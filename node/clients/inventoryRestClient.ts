import { ExternalClient } from '@vtex/api'
import type { InstanceOptions, IOContext } from '@vtex/api'

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

  /**
   * Updates inventory by searching through SKU and warehouse.
   * @param body
   * @param skuId
   * @param warehouseId
   * @returns
   */
  public async updateInventory(
    body: UpdateinventoryBySkuAndWarehouseRequest,
    skuId: number,
    warehouseId: number | string
  ): Promise<string> {
    return this.http.put(
      `/api/logistics/pvt/inventory/skus/${skuId}/warehouses/${warehouseId}`,
      body
    )
  }
}
