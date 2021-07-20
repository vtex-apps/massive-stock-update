import type { QueryProductsArgs } from 'vtex.catalog-graphql'

import CatalogGraphQLBaseClient from '../CatalogGraphQLBaseClient'
import type { QueriedProductsSuggestionsPage } from './types'


// vtex.inventory-graphql@0.18.1

type GetProductsSuggestionsArgs = Pick<QueryProductsArgs, 'term' | 'pageSize'>

/*
{
  "data": [
    {
      "sku": "asdasd",
      "warehouseId": 123,
      "quantity": 50,
      "unlimited": false
    },
    {
      "sku": 2,
      "warehouseId": 123,
      "quantity": 40,
      "unlimited": false
    }
  ]
}
*/
const GET_PRODUCTS_SUGGESTIONS_QUERY = `
  query ProductsSuggestions($term: String!, $pageSize: Int!) {
    products(term: $term, page: 1, pageSize: $pageSize) {
      items {
        id
        name
        skus {
          id
          skuName
        }
        /*


        */
      }
    }
  }
`
/*
mutation miMutation($data:[InventoryProductQuantityUpdateInput!]!){
  updateInventoryProductsQuantities(data:$data) {
    sku
    warehouseId
    succe|ss
    errorCode
    errorMessage
  }
}

*/

export class CatalogGraphQLClient extends CatalogGraphQLBaseClient {
  public getProductsSuggestions = (options: GetProductsSuggestionsArgs) =>
    this.graphql
      .query<
        {
          products: QueriedProductsSuggestionsPage
        },
        GetProductsSuggestionsArgs
      >({
        query: GET_PRODUCTS_SUGGESTIONS_QUERY,
        variables: options,
      })
      .then((response) => response.data?.products.items)
}