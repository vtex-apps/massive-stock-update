export async function inventoryMiddleware(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { inventoryRestClient },
    state: { validatedBody },
  } = ctx

  try {
    const response = await Promise.all(
      validatedBody.map(async (arg) => {
        return updateInventory(arg)
      })
    )

    ctx.body = {
      message: response,
    }
    ctx.status = 200
    await next()
  } catch (error) {
    const { headers } = error.response
    const errorMessage = headers['x-vtex-error-message'].split('%20').join(' ')

    ctx.status = 400
    ctx.response.body = {
      error: error.message,
      status: error.response.statusText,
      errorMessage,
    }
  }

  async function updateInventory(
    arg: InventoryItem
  ): Promise<InventoryMiddlewareResponse> {
    const { sku } = arg
    const { warehouseId } = arg
    const body: Body = {
      quantity: arg.quantity,
      unlimited: arg.unlimited,
    }

    const updateInventoryRestClientResponse =
      await inventoryRestClient.updateInventory(body, sku, warehouseId)

    const inventoryMiddlewareResponse: InventoryMiddlewareResponse = {
      sku: arg.sku,
      success: updateInventoryRestClientResponse,
      warehouseId: arg.warehouseId,
    }

    return inventoryMiddlewareResponse
  }
}

export type Body = {
  quantity: number
  unlimited: boolean
}

type MyHeaders = {
  'x-vtex-error-message': string
}
