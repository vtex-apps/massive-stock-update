import { JanusClient } from '@vtex/api'
import type { InstanceOptions, IOContext, IOResponse } from '@vtex/api'

import type { UpdateinventoryBySkuAndWarehouseRequest } from '../middlewares/inventoryMiddleware'

export default class InventoryRestClient extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        VtexIdclientAutCookie: context.authToken,
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  // eslint-disable-next-line max-params
  public async updateInventory(
    authToken: string,
    body: UpdateinventoryBySkuAndWarehouseRequest,
    skuId?: number | string,
    warehouseId?: number | string
  ): Promise<IOResponse<string>> {
    return this.http.putRaw(
      `http://${this.context.account}.vtexcommercestable.com.br/api/logistics/pvt/inventory/skus/${skuId}/warehouses/${warehouseId}`,
      body,
      {
        headers: {
          VtexIdclientAutCookie: authToken,
        },
      }
    )
  }
}
