import type { EventContext } from '@vtex/api'
import { LogLevel } from '@vtex/api'

import type { Clients } from '../../clients'
import type { UpdateinventoryBySkuAndWarehouseRequest } from '../../middlewares/inventoryMiddleware'

export const operation = async (
  ctx: EventContext<Clients>,
  /*   responseManager: ResponseManager,
   */ sku: number,
  warehouseId: string,
  quantity: number,
  unlimitedQuantity: boolean,
  dateUtcOnBalanceSystem: string,
  appKey: string,
  appToken: string,
  vtexIdToken: string
  // eslint-disable-next-line max-params
): Promise<OperationResponse> => {
  try {
    const {
      clients: { inventoryRestClient },
    } = ctx

    const updateinventoryBySkuAndWarehouseRequest: UpdateinventoryBySkuAndWarehouseRequest = {
      quantity,
      dateUtcOnBalanceSystem,
      unlimitedQuantity,
    }

    const updateInventoryRestClientResponse = await inventoryRestClient.updateInventory(
      vtexIdToken,
      updateinventoryBySkuAndWarehouseRequest,
      sku,
      warehouseId,
      appKey,
      appToken
    )

    const operationResponse = {
      item: {
        sku,
        success: updateInventoryRestClientResponse.data,
        warehouseId,
        quantity,
        unlimitedQuantity,
        dateUtcOnBalanceSystem,
      },
      type: 'ok',
    }

    return operationResponse
  } catch (error) {
    const {
      vtex: { logger },
    } = ctx

    logger.log(
      {
        message: 'massive-stock-update - operation Error en Cliente',
        errorMessage: {
          error,
        },
      },
      LogLevel.Info
    )
    const data = error.response ? error.response.data : ''
    const restClientErrorResponse: UpdateResponse = {
      sku,
      warehouseId,
      quantity,
      unlimitedQuantity,
      dateUtcOnBalanceSystem,
      success: 'false',
      error: error.response ? error.response.status : 500,
      errorMessage: data.error ? data.error.message : data,
    }

    if (error.response && error.response.status === 429) {
      restClientErrorResponse.errorMessage = error.response
        ? error.response.headers['ratelimit-reset']
        : '0'
      // responseManager.errors429.push(restClientErrorResponse)

      const operationResponse = {
        item: restClientErrorResponse,
        type: '429',
      }

      return operationResponse
    }
    // responseManager.updateResponse.push(restClientErrorResponse)

    const operationresponse = {
      item: restClientErrorResponse,
      type: 'error',
    }

    return operationresponse
  }
}
