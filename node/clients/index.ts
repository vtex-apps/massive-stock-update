import { IOClients } from '@vtex/api'

import Inventory from './inventory'
import InventoryExternal from './inventoryExternal'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get inventory() {
    return this.getOrSet('inventory', Inventory)
  }

  public get inventoryExternal() {
    return this.getOrSet('inventoryExternal', InventoryExternal)
  }
}
