// import { json } from "co-body"

export async function updateStock(ctx: Context, next: () => Promise<any>) {
  // console.log("updateStock middleware");
  const {
    clients: { inventory },
  } = ctx

  // const body = await json(ctx.req)
  const response = await inventory.updateInventory([
    {
      sku: 2,
      warehouseId: 123,
      quantity: 50,
      unlimited: false,
    },
  ])

  // console.log("resultado:" + response);
  ctx.status = 200
  ctx.body = { resultado: response }

  // TEST
  /*   ctx.status = 200;
  ctx.body = {"updateInventoryProductsQuantities": [
    {
      "sku" : "1",
      "warehouseId": "123",
      "success": true,
      "errorCode": null,
      "errorMessage": null
  }]}; */
  await next()
}
