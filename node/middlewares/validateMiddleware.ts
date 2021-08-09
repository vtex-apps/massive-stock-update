import { json } from 'co-body'

export async function validateMiddleware(
  ctx: Context,
  next: () => Promise<any>
) {
  const body = await json(ctx.req)
  const errorList: InventoryMiddlewareResponse[] = []

  for (const i of body) {
    const { sku, warehouseId, quantity, unlimited } = i

    if (
      !(
        typeof sku === 'number' &&
        (typeof warehouseId === 'number' || typeof warehouseId === 'string') &&
        typeof quantity === 'number' &&
        typeof unlimited === 'boolean'
      )
    ) {
      errorList.push({
        sku,
        warehouseId,
        success: 'false',
        error: 'Request failed with status code 400',
        errorMessage: `Some field does not have a valid type`,
      })
    }
  }

  if (errorList.length >= 1) {
    ctx.status = 400
    ctx.response.body = {
      message: errorList,
    }

    return
  }

  ctx.state.validatedBody = body
  await next()
}
