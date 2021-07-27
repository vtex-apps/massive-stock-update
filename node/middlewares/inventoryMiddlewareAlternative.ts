// import { json } from "co-body"

export async function inventoryMiddlewareAlternative(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { inventoryGraphQL },
  } = ctx

  // const body = await json(ctx.req)
  const response = await inventoryGraphQL.updateInventory([
    {
      sku: 2,
      warehouseId: 123,
      quantity: 50,
      unlimited: false,
    },
  ])

  ctx.status = 200
  ctx.body = { resultado: response }
  await next()
}
