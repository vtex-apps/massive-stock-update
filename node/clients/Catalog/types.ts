import type { CollectionProduct, SkuCollectionItem } from 'vtex.catalog-graphql'
import type Maybe from 'graphql/tsutils/Maybe'

export type QueriedProductsSuggestionsPage = {
  items: QueriedProductSuggestion[]
}

type QueriedProductSuggestion = Pick<CollectionProduct, 'id' | 'name'> & {
  // About the Maybe, see:
  // https://github.com/vtex/catalog-graphql/blob/master/graphql/types/Product.graphql#L185
  skus: Array<Maybe<Pick<SkuCollectionItem, 'id' | 'skuName'>>>
}

// Too many fields. Only typing the used ones.
export type SkuResponse = {
  Id: number
  KitItems: SkuKitItem[]
}

type SkuKitItem = {
  Id: number
}

// Copied from vtex.catalog-graphql@1.x.
// See https://github.com/vtex/catalog-graphql/blob/master/node/clients/products/vtex.ts#L43
export type SearchProductsResponse = {
  items: SearchedProductResponse[]
  paging: PagingInfo
}

type SearchedProductResponse = {
  stockKeepingUnitBasicDtoCollection: SkuSearchResponse[]
  productId: number
  refId: string
  productName: string
  imageUrl: string
  detailUrl: string
  isActive: boolean
  productClusterIds: number[]
}

type SkuSearchResponse = {
  id: number
  skuName: string
  isKit: boolean
  refId: Maybe<string>
  skuKitItems: string[]
  productClusterIds: number[]
  imageUrl: Maybe<string>
  isActive: boolean
}

type PagingInfo = {
  page: number
  perPage: number
  total: number
  pages: number
}

export type GetProductSkuIdsResponse = {
  data: Record<string, number[]>
  range: {
    total: number
    from: number
    to: number
  }
}