import type { EventContext } from '@vtex/api'
import { LogLevel } from '@vtex/api'
import { parseAsync } from 'json2csv'
// import { v4 as uuidv4 } from 'uuid'
// import Blob from 'fetch-blob'

import { formatList } from './utils/jsonToCsv'
import type { Clients } from '../clients'

export async function createCSV(ctx: EventContext<Clients>) {
  const {
    body: { vtexIdToken, appKey, appToken, validatedBody },
    vtex: { logger },
    clients: { inventoryRestClient },
  } = ctx

  try {
    const formatlist = formatList(validatedBody)
    const fields = [
      'SkuId',
      'TotalQuantity',
      'AvailableQuantity',
      'WarehouseId',
      'UnlimitedQuantity',
    ]

    const opts = { fields }
    const csv = await parseAsync(formatlist, opts)

    const csvFromExcel = `SkuId;TotalQuantity;ReservedQuantity;AvailableQuantity;WarehouseId;WarehouseName;RefId;IsActive;UnlimitedQuantity;LockIds;DispatchedReservations
    10;15;0;15;123;Inventario;;True;False;;0`

    const csvBuffer = Buffer.from(csvFromExcel, 'utf-8')

    console.info({
      authToken: vtexIdToken,
      key: appKey,
      token: appToken,
      csvToUpload: csv,
      csvBufferToUpload: csvBuffer,
    })

    await inventoryRestClient.updateInventoryByCSV(
      csvBuffer,
      vtexIdToken,
      appKey,
      appToken
    )
  } catch (err) {
    console.info('error: ', err)
    logger.log(
      {
        message: 'Error createCSV',
        detail: {
          error: err,
        },
      },
      LogLevel.Error
    )
  }
}
