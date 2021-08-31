export async function inventoryMiddleware(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { inventoryRestClient },
    state: { validatedBody },
  } = ctx

  const start = Date.now()

  // eslint-disable-next-line no-console
  const responseList = []

  for (let index = 0; index < validatedBody.length; index++) {
    const element = validatedBody[index]

    // eslint-disable-next-line no-console
    console.log('index', `${index + 1}/${validatedBody.length}`)

    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await updateInventory(element)

      responseList.push(response)
    } catch (error) {
      if (error.response.status === 429) {
        const {
          response: { headers },
        } = error

        // eslint-disable-next-line no-console
        console.log('ratelimit', headers['x-ratelimit-reset'])

        setTimeout(() => {
          // eslint-disable-next-line no-console
          console.log('timeout')
        }, parseFloat(headers['x-ratelimit-reset']) * 1000)
        index--
        continue
      } else {
        const updateInventoryRestClientErrorResponse = {
          sku: element.sku,
          success: 'false',
          warehouseId: element.warehouseId,
          error: error.status,
          errorMessage: error.data,
        }

        responseList.push(updateInventoryRestClientErrorResponse)
      }
    }
  }

  /*   responseList = await Promise.all(
      validatedBody.map(async (arg) => {
        return updateInventory(arg)
      })
    )
   */
  ctx.body = {
    responseList,
  }
  ctx.status = 200
  const end = Date.now()

  // eslint-disable-next-line no-console
  console.log(end - start)

  // eslint-disable-next-line no-console
  //
  await next()

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

    const getSkuResponse = await inventoryRestClient.getSku(sku)

    const updateInventoryResponse = await inventoryRestClient.updateInventory(
      body,
      getSkuResponse.data.Id,
      warehouseId
    )

    const inventoryMiddlewareResponse: UpdateResponse = {
      sku: getSkuResponse.data.Id,
      success: updateInventoryResponse.data,
      warehouseId: arg.warehouseId,
    }

    return inventoryMiddlewareResponse
  }
}

export type UpdateinventoryBySkuAndWarehouseRequest = {
  unlimitedQuantity: boolean
  dateUtcOnBalanceSystem: string
  quantity: number
}
