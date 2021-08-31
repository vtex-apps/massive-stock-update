import { ExternalClient } from '@vtex/api'
import type { InstanceOptions, IOContext, IOResponse } from '@vtex/api'

import type { UpdateinventoryBySkuAndWarehouseRequest } from '../middlewares/inventoryMiddleware'

export default class InventoryRestClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://${context.account}.vtexcommercestable.com.br`, context, {
      ...options,
      headers: {
        VtexIdClientAutCookie:
          context.storeUserAuthToken ??
          context.adminUserAuthToken ??
          context.authToken ??
          '',
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
      },
    })
  }

  public async updateInventory(
    body: UpdateinventoryBySkuAndWarehouseRequest,
    skuId: number,
    warehouseId: number | string
  ): Promise<IOResponse<string>> {
    return this.http.putRaw(
      `/api/logistics/pvt/inventory/skus/${skuId}/warehouses/${warehouseId}`,
      body
    )
  }

  public async getSku(skuId: number): Promise<IOResponse<GetSKUResponse>> {
    return this.http.getRaw(`/api/catalog/pvt/stockkeepingunit/${skuId}`)
  }
}

export interface GetSKUResponse {
  Id: number
}
