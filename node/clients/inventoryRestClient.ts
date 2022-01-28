/* eslint-disable @typescript-eslint/default-param-last */
import { JanusClient } from '@vtex/api'
import type { InstanceOptions, IOContext, IOResponse } from '@vtex/api'
import FormData from 'form-data'

export default class InventoryRestClient extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
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
              'Content-Type': 'application/json; charset=utf-8',
              Accept: 'application/json',
              VtexIdclientAutCookie: authToken,
            },
          }
        : {
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              Accept: 'application/json',

              'X-VTEX-API-AppKey': appKey,
              'X-VTEX-API-AppToken': appToken,
            },
          }

    const url = `http://${this.context.account}.vtexcommercestable.com.br/api/logistics/pvt/inventory/skus/${skuId}/warehouses/${warehouseId}`

    return this.http.putRaw(url, body, headers)
  }

  // eslint-disable-next-line max-params
  public async updateInventoryByCSV(
    fileContent: Buffer,
    authToken: string,
    appKey?: string,
    appToken?: string
  ) {
    const formData = new FormData()

    formData.append('file', fileContent, 'file.csv')

    const url = `http://${this.context.account}.vtexcommercestable.com.br/api/logistics/pvt/inventory/warehouseitems/import`

    const headers =
      authToken !== ''
        ? {
            headers: {
              ...formData.getHeaders(),
              VtexIdclientAutCookie: authToken,
            },
          }
        : {
            headers: {
              ...formData.getHeaders(),
              'X-VTEX-API-AppKey': appKey,
              'X-VTEX-API-AppToken': appToken,
            },
          }

    return this.http
      .post(url, formData, headers)
      .then((data) => {
        console.info({
          response: data,
        })
      })
      .catch((error) => {
        console.info({
          response: error,
        })
      })
  }
}
