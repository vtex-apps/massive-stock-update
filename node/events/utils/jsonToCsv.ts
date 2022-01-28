/* eslint-disable @typescript-eslint/no-explicit-any */
export const jsonToCsv = (json: any) => {
  const fields = Object.keys(json[0])
  const replacer = (_key: any, value: any) => {
    return value === null ? '' : value
  }

  let csv = json.map(function createCsv(row: { [x: string]: any }) {
    return fields
      .map(function createRow(fieldName) {
        return JSON.stringify(row[fieldName], replacer)
      })
      .join(',')
  })

  csv.unshift(fields.join(',')) // add header column
  csv = csv.join('\r\n')

  return csv
}

export function formatList(validateBody: UpdateRequest[]) {
  return validateBody.map((item) => {
    return {
      SkuId: item.sku,
      TotalQuantity: item.quantity,
      ReservedQuantity: item.quantity,
      AvailableQuantity: item.quantity,
      WarehouseId: item.warehouseId,
      /*   WarehouseName: 'Inventario',
      RefId: '',
      IsActive: 'True', */
      UnlimitedQuantity: item.unlimitedQuantity,
      /*   LockIds: '',
      DispatchedReservations: '0', */
    }
  })
}
