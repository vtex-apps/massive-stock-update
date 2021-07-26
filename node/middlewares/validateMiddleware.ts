import { json } from 'co-body'

export async function validateMiddleware(
  ctx: Context,
  next: () => Promise<any>
) {
  const body = await json(ctx.req)

  for (const i in body) {
    const item = body[i]
    const { sku } = item
    const { warehouseId } = item
    const { quantity } = item
    const { unlimited } = item

    if (
      !(
        typeof sku === 'number' &&
        (typeof warehouseId === 'number' || typeof warehouseId === 'string') &&
        typeof quantity === 'number' &&
        typeof unlimited === 'boolean'
      )
    ) {
      ctx.status = 400
      ctx.response.body = {
        error: 'Request failed with status code 400',
        status: 'Bad Request',
        errorMessage: `Some field does not have a valid type: {sku:${sku}, warehouseId:${warehouseId}, quantity:${quantity}, unlimited:${unlimited}}`,
      }

      return
    }
  }

  ctx.state.validatedBody = body
  await next()
}
