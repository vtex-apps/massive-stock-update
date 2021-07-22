import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

import type { Body } from '../middlewares/inventoryMiddleware'

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

  /**
   * Updates inventory by searching through SKU and warehouse.
   * @param body
   * @param skuId
   * @param warehouseId
   * @returns
   */
  public async updateInventory(
    body: Body,
    skuId: number,
    warehouseId: number
  ): Promise<string> {
    return this.http.put(
      `/api/logistics/pvt/inventory/skus/${skuId}/warehouses/${warehouseId}`,
      body
    )
  }
}
