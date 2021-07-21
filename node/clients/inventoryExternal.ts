import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

import type { Body } from '../middlewares/updateStockExternal'

export default class InventoryExternal extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://${context.account}.vtexcommercestable.com.br`, context, {
      ...options,
      headers: {
        VtexIdClientAutCookie: context.authToken,
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public async updateStock(
    body: Body,
    skuId: string,
    warehouseId: string
  ): Promise<string> {
    /*  console.log("updateStock client init");
        console.log("body:", body);
        console.log("skuId", skuId);
        console.log("warehouseId", warehouseId); */

    return this.http.put(
      `/api/logistics/pvt/inventory/skus/${skuId}/warehouses/${warehouseId}`,
      body
    )
  }
}
