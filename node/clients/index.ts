import { IOClients } from '@vtex/api'

import InventoryRestClient from './inventoryRestClient'

export class Clients extends IOClients {
  public get inventoryRestClient() {
    return this.getOrSet('inventoryRestClient', InventoryRestClient)
  }
}
