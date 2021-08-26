export async function inventoryMiddleware(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { inventoryRestClient },
    state: { validatedBody },
  } = ctx

  const responseList = await Promise.all(
    validatedBody.map(async (arg) => {
      return updateInventory(arg)
    })
  )

  ctx.body = {
    responseList,
  }
  ctx.status = 200
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

    try {
      const updateInventoryRestClientResponse =
        await inventoryRestClient.updateInventory(body, sku, warehouseId)

      const inventoryMiddlewareResponse: UpdateResponse = {
        sku: arg.sku,
        success: updateInventoryRestClientResponse,
        warehouseId: arg.warehouseId,
      }

      return inventoryMiddlewareResponse
    } catch (error) {
      const { headers } = error.response
      const errorMessage = headers['x-vtex-error-message']
        .split('%20')
        .join(' ')

      const updateInventoryRestClientErrorResponse = {
        sku: arg.sku,
        success: 'false',
        warehouseId: arg.warehouseId,
        error: error.response.status,
        errorMessage,
      }

      return updateInventoryRestClientErrorResponse
    }
  }
}

export type UpdateinventoryBySkuAndWarehouseRequest = {
  unlimitedQuantity: boolean
  dateUtcOnBalanceSystem: string
  quantity: number
}
