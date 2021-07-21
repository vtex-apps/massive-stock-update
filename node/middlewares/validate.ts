import { json } from 'co-body'

export async function validate(ctx: Context, next: () => Promise<any>) {
  // console.log("validate middleware");
  const body = await json(ctx.req)

  // console.log("body", body);
  for (const i in body) {
    const item = body[i]
    const { sku } = item
    const { warehouseId } = item
    const { quantity } = item
    const { unlimited } = item

    if (
      !(
        typeof sku === 'number' &&
        typeof warehouseId === 'number' &&
        typeof quantity === 'number' &&
        typeof unlimited === 'boolean'
      )
    ) {
      ctx.status = 400
      ctx.body = {
        error: `TypeError: Some field does not have a valid type: {sku:${sku}, warehouseId:${warehouseId}, quantity:${quantity}, unlimited:${unlimited}}`,
      }

      return
    }
  }

  ctx.state.validatedBody = body
  // console.log("validate middleware Ok");
  await next()
}
