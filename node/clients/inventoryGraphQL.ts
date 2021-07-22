import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppGraphQLClient } from '@vtex/api'

import { statusToError } from '../utils'

const INVENTORY_GRAPHQL_APP = 'vtex.inventory-graphql@0.x'
const INVENTORY_MUTATION = `
mutation myMutation($data:[InventoryProductQuantityUpdateInput!]!){
    updateInventoryProductsQuantities(data:$data) {
      sku
      warehouseId
      success
      errorCode
      errorMessage
    }
  }
`

interface InventoryProductQuantityUpdateInput {
  sku: number
  warehouseId: number
  quantity: number
  unlimited: boolean
}

interface InventoryProductQuantityUpdateOutput {
  sku: string
  warehouseId: number
  success: boolean
  errorCode: number
  errorMessage: string
}

export default class InventoryGraphQL extends AppGraphQLClient {
  constructor(ctx: IOContext, opts?: InstanceOptions) {
    super(INVENTORY_GRAPHQL_APP, ctx, opts)
  }

  /**
   * Update one or many inventories by searching through SKUs and warehouse.
   * @param args InventoryProductQuantityUpdateInput
   * @returns InventoryProductQuantityUpdateOutput
   */
  public updateInventory = (args: InventoryProductQuantityUpdateInput[]) => {
    try {
      return this.graphql.mutate<
        InventoryProductQuantityUpdateOutput[],
        { dataList: InventoryProductQuantityUpdateInput[] }
      >({
        mutate: INVENTORY_MUTATION,
        variables: { dataList: args },
      })
    } catch (error) {
      console.error(`updateInventory error:${error}`)

      return statusToError(error)
    }
  }
}
