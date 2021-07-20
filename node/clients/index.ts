import { IOClients } from '@vtex/api'

import Status from './status'
import Pricing from './pricing'

import { CatalogGraphQLClient } from './Catalog/GraphQLClient'


// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get status() {
    return this.getOrSet('status', Status)
  }
  
  public get pricing() {
    return this.getOrSet('pricing', Pricing)
  }

  public get catalogGQL(): CatalogGraphQLClient {
    return this.getOrSet('CatalogGraphQL', CatalogGraphQLClient)
  }
}
