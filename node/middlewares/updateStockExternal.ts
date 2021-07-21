export async function updateStockExternal(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { inventoryExternal },
    state: { validatedBody },
  } = ctx

  interface MyResponse {
    sku: number
    success: string
  }

  const responselist: [MyResponse] = [{ sku: 0, success: 'true' }]
  let count = 0

  try {
    validatedBody.forEach(async (inventoryItem) => {
      count++
      // console.log("inventoryItem", inventoryItem)
      const sku = inventoryItem.sku.toString()
      const warehouseId = inventoryItem.warehouseId.toString()
      const body: Body = {
        quantity: inventoryItem.quantity,
        unlimited: inventoryItem.unlimited,
      }

      // console.log("body", JSON.stringify(body));
      const value = await inventoryExternal.updateStock(body, sku, warehouseId)

      const valueObj = JSON.parse(value)

      if (!valueObj.error) {
        responselist.push({
          sku: inventoryItem.sku,
          success: value,
        })
      } else {
        throw new Error('pasaron cosas')
      }
    })
    // console.log("count", count);
    ctx.body = {
      message: JSON.stringify(responselist),
      count,
    }
    ctx.status = 200
    await next()
  } catch (error) {
    // console.log("count", count);
    // console.log("Mi error: ", error.message);
    ctx.body = { message: error.message }
    ctx.status = error.status
    await next()
  }
}

export type Body = {
  quantity: number
  unlimited: boolean
}
