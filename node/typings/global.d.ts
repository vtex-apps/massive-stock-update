interface ResponseManager {
  updateResponse: UpdateResponse[]
  errors429: UpdateResponse[]
}

interface UpdateRequest {
  sku: number
  warehouseId: string
  quantity: number
  unlimitedQuantity: boolean
  dateUtcOnBalanceSystem: string
}

interface UpdateResponse {
  sku: number
  warehouseId: string
  success: string
  error?: string
  errorMessage?: string
  quantity: number
  unlimitedQuantity: boolean
  dateUtcOnBalanceSystem: string
}

interface OperationResponse {
  item: UpdateResponse
  type: string
}

interface UpdateinventoryBySkuAndWarehouseRequest {
  unlimitedQuantity?: boolean
  dateUtcOnBalanceSystem?: string
  quantity?: number
}

interface IncomingFile {
  filename: string
  mimeType: string
  encoding: string
}

interface UpdateProcess {
  list: UpdateRequest[]
  requestId: string
}
