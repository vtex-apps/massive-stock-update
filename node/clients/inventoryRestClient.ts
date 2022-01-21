import { JanusClient } from '@vtex/api'
import type { InstanceOptions, IOContext, IOResponse } from '@vtex/api'


export default class InventoryRestClient extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  // eslint-disable-next-line max-params
  public async updateInventory(
    authToken: string,
    body: any,
    skuId: number,
    warehouseId: string,
    appKey?: string,
    appToken?: string
  ): Promise<IOResponse<string>> {
    const headers =
      authToken !== ''
        ? {
            headers: {
              VtexIdclientAutCookie: authToken,
            },
          }
        : {
            headers: {
              'X-VTEX-API-AppKey': appKey,
              'X-VTEX-API-AppToken': appToken,
            },
          }

    const url = `http://${this.context.account}.vtexcommercestable.com.br/api/logistics/pvt/inventory/skus/${skuId}/warehouses/${warehouseId}`

    return this.http.putRaw(url, body, headers)
  }
}
