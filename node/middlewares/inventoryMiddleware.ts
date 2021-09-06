export async function inventoryMiddleware(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { inventoryRestClient },
    state: { validatedBody },
  } = ctx

  const responseList: UpdateResponse[] = []
  // let maxRetry = 3
  /*  const withERROR: UpdateResponse[] = [
     {
       sku: 12,
       success: 'false',
       warehouseId: 123,
       unlimitedQuantity: false,
       dateUtcOnBalanceSystem: undefined,
       error: 429,
       errorMessage: 'To many request',
     },
     { sku: 13, success: 'true', warehouseId: 123 },
   ] */

  // const expected = await retryOperation(withERROR)

  try {
    const expected = await operationRetry(
      await Promise.all(
        validatedBody.map(async (arg) => {
          return updateInventory(arg)
        })
      )
    )

    // eslint-disable-next-line no-console
    console.log('expected', expected)
    if (expected) {
      // eslint-disable-next-line array-callback-return
      const responseOk: UpdateResponse[] = responseList.filter((e) => {
        return e.success !== 'false'
      })

      // eslint-disable-next-line array-callback-return
      const responseBad: UpdateResponse[] = responseList.filter((e) => {
        return e.success === 'false'
      })

      ctx.body = {
        responseOk,
        responseBad,
        count: responseList.length,
      }
      ctx.status = 200
      await next()
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    ctx.status = 450
    // eslint-disable-next-line no-console
    console.log('que paso ahora', error)
    await next()
  }

  async function updateInventory(arg: UpdateRequest): Promise<UpdateResponse> {
    const {
      sku,
      warehouseId,
      quantity,
      unlimitedQuantity,
      dateUtcOnBalanceSystem,
    } = arg

    const body: UpdateinventoryBySkuAndWarehouseRequest = {
      quantity,
      dateUtcOnBalanceSystem,
      unlimitedQuantity,
    }

    try {
      const updateInventoryRestClientResponse =
        await inventoryRestClient.updateInventory(body, sku, warehouseId)

      const inventoryMiddlewareResponse: UpdateResponse = {
        sku: arg.sku,
        success: updateInventoryRestClientResponse.data,
        warehouseId: arg.warehouseId,
      }

      return inventoryMiddlewareResponse
    } catch (error) {
      const { data } = error.response
      const updateInventoryRestClientErrorResponse = {
        sku: arg.sku,
        success: 'false',
        warehouseId: arg.warehouseId,
        quantity: arg.quantity,
        unlimitedQuantity: arg.unlimitedQuantity,
        dateUtcOnBalanceSystem: arg.dateUtcOnBalanceSystem,
        error: error.response.status,
        errorMessage: data.error ? data.error.message : data,
      }

      if (error.response.status === 429) {
        // eslint-disable-next-line no-console
        console.log('header', error.response.headers['x-ratelimit-reset'])
        // eslint-disable-next-line no-console
        console.log('headers', error.response.headers)
        updateInventoryRestClientErrorResponse.errorMessage =
          error.response.headers['x-ratelimit-reset']
      }

      return updateInventoryRestClientErrorResponse
    }
  }

  async function operationRetry(
    updateResponseList: UpdateResponse[]
  ): Promise<any> {
    const response = await findStoppedRequests(updateResponseList)

    addResponsesSuccessfulUpdates(updateResponseList)

    return response
  }

  async function findStoppedRequests(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    responseList: UpdateResponse[]
  ): Promise<any> {
    const retryList: UpdateRequest[] = []
    let value = '0'

    for (const index in responseList) {
      const response = responseList[index]

      if (response.error && response.error === 429) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define

        // eslint-disable-next-line no-console
        console.log('error message:', response.errorMessage)
        if (response.errorMessage && response.errorMessage > value) {
          value = response.errorMessage
        }

        // eslint-disable-next-line no-console
        console.log('errorMessage', value)

        retryList.push({
          sku: response.sku,
          warehouseId: response.warehouseId,
          quantity: response.quantity,
          unlimitedQuantity: response.unlimitedQuantity,
          dateUtcOnBalanceSystem: response.dateUtcOnBalanceSystem,
        })
      }
    }

    if (retryList.length >= 1) {
      // eslint-disable-next-line no-console
      console.log(
        `reintento activado en espera por ${parseFloat(value) * 1000} segundos`
      )

      setTimeout(async () => {
        const retryOperation = await operationRetry(
          await Promise.all(
            retryList.map(async (arg) => {
              return updateInventory(arg)
            })
          )
        )

        // eslint-disable-next-line no-console
        console.log('respuesta de reintento', retryOperation)

        return retryOperation
      }, parseFloat(value) * 1000)
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
