import { IOClients } from '@vtex/api'

import InventoryGraphQL from './inventoryGraphQL'
import InventoryRestClient from './inventoryRestClient'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get inventoryGraphQL() {
    return this.getOrSet('inventoryGraphQL', InventoryGraphQL)
  }

  public get inventoryRestClient() {
    return this.getOrSet('inventoryRestClient', InventoryRestClient)
  }
}
