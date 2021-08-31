export async function inventoryMiddleware(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { inventoryRestClient },
    state: { validatedBody },
  } = ctx

  const responseList = []

  for (let index = 0; index < validatedBody.length; index++) {
    const element = validatedBody[index]

    try {
      const {
        sku,
        warehouseId,
        quantity,
        unlimitedQuantity,
        dateUtcOnBalanceSystem,
      } = element

      const body: UpdateinventoryBySkuAndWarehouseRequest = {
        quantity,
        dateUtcOnBalanceSystem,
        unlimitedQuantity,
      }

      // eslint-disable-next-line no-await-in-loop
      const getSkuResponse = await inventoryRestClient.getSku(sku)
      // eslint-disable-next-line no-await-in-loop
      const updateInventoryResponse = await inventoryRestClient.updateInventory(
        body,
        getSkuResponse.data.Id,
        warehouseId
      )

      const inventoryMiddlewareResponse: UpdateResponse = {
        sku: getSkuResponse.data.Id,
        success: updateInventoryResponse.data,
        warehouseId,
      }

      responseList.push(inventoryMiddlewareResponse)
    } catch (error) {
      if (error.response.status === 429) {
        const {
          response: { headers },
        } = error

        setTimeout(() => {}, parseFloat(headers['x-ratelimit-reset']) * 1000)
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

  ctx.body = {
    responseList,
  }
  ctx.status = 200

  await next()
}

export type UpdateinventoryBySkuAndWarehouseRequest = {
  unlimitedQuantity: boolean
  dateUtcOnBalanceSystem: string
  quantity: number
}
