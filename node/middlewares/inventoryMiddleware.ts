export async function inventoryMiddleware(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { inventoryRestClient },
    state: { validatedBody },
  } = ctx

  const responseList: UpdateResponse[] = []

  try {
    const expected = await operationRetry(
      await Promise.all(
        validatedBody.map(async (item) => {
          return updateInventory(item)
        })
      )
    )

    if (expected) {
      const successfulResponses: UpdateResponse[] = responseList.filter((e) => {
        return e.success !== 'false'
      })

      const failedResponses: UpdateResponse[] = responseList.filter((e) => {
        return e.success === 'false'
      })

      ctx.status = 200
      ctx.body = {
        successfulResponses: {
          elements: successfulResponses,
          quantity: successfulResponses.length,
        },
        failedResponses: {
          elements: failedResponses,
          quantity: failedResponses.length,
        },
        total: responseList.length,
      }

      await next()
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = error
    await next()
  }

  async function updateInventory(
    updateRequest: UpdateRequest
  ): Promise<UpdateResponse> {
    const {
      sku,
      warehouseId,
      quantity,
      unlimitedQuantity,
      dateUtcOnBalanceSystem,
    } = updateRequest

    const body: UpdateinventoryBySkuAndWarehouseRequest = {
      quantity,
      dateUtcOnBalanceSystem,
      unlimitedQuantity,
    }

    try {
      const updateInventoryRestClientResponse = await inventoryRestClient.updateInventory(
        body,
        sku,
        warehouseId
      )

      const inventoryMiddlewareResponse: UpdateResponse = {
        sku: updateRequest.sku,
        success: updateInventoryRestClientResponse.data,
        warehouseId: updateRequest.warehouseId,
        quantity: updateRequest.quantity,
        unlimitedQuantity: updateRequest.unlimitedQuantity,
        dateUtcOnBalanceSystem: updateRequest.dateUtcOnBalanceSystem,
      }

      return inventoryMiddlewareResponse
    } catch (error) {
      const data = error.response ? error.response.data : ''
      const updateInventoryRestClientErrorResponse = {
        sku: updateRequest.sku,
        success: 'false',
        warehouseId: updateRequest.warehouseId,
        quantity: updateRequest.quantity,
        unlimitedQuantity: updateRequest.unlimitedQuantity,
        dateUtcOnBalanceSystem: updateRequest.dateUtcOnBalanceSystem,
        error: error.response ? error.response.status : 500,
        errorMessage: data.error ? data.error.message : data,
      }

      if (error.response && error.response.status === 429) {
        updateInventoryRestClientErrorResponse.errorMessage = error.response
          ? error.response.headers['ratelimit-reset']
          : ''
      }

      return updateInventoryRestClientErrorResponse
    }
  }

  async function operationRetry(
    updateResponseList: UpdateResponse[]
  ): Promise<any> {
    addResponsesSuccessfulUpdates(updateResponseList)

    const response = await findStoppedRequests(updateResponseList)

    return response
  }

  async function findStoppedRequests(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    responseList: UpdateResponse[]
  ): Promise<any> {
    const retryList: UpdateRequest[] = []
    let value = '0'

    if (responseList.length >= 1) {
      for (const index in responseList) {
        const response = responseList[index]

        if (response.error && response.error === 429) {
          if (response.errorMessage && response.errorMessage > value) {
            value = response.errorMessage
          }

          if (value === '0') {
            value = '20'
          }

          retryList.push({
            sku: response.sku,
            warehouseId: response.warehouseId,
            quantity: response.quantity,
            unlimitedQuantity: response.unlimitedQuantity,
            dateUtcOnBalanceSystem: response.dateUtcOnBalanceSystem,
          })
        }
      }
    }

    if (retryList.length >= 1) {
      let retryOperation: UpdateResponse[] = []

      const awaitTimeout = (delay: string) =>
        new Promise((resolve) => setTimeout(resolve, parseFloat(delay) * 1000))

      await awaitTimeout(value)

      retryOperation = await Promise.all(
        retryList.map(async (item) => {
          return updateInventory(item)
        })
      )

      return operationRetry(retryOperation)
    }

    return true
  }

  function addResponsesSuccessfulUpdates(
    updateResponseList: UpdateResponse[]
  ): void {
    for (const index in updateResponseList) {
      const updateResponse = updateResponseList[index]

      if (updateResponse.error !== 429) {
        responseList.push(updateResponse)
      }
    }
  }
}

export type UpdateinventoryBySkuAndWarehouseRequest = {
  unlimitedQuantity?: boolean
  dateUtcOnBalanceSystem?: string
  quantity?: number
}
