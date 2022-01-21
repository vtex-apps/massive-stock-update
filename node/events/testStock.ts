import type { EventContext } from '@vtex/api'
import { LogLevel } from '@vtex/api'

import type { Clients } from '../clients'
import {
  buildResponse,
  buildServiceErrorResponse,
  operation,
  retryCall,
} from './utils'

export async function testStock(ctx: EventContext<Clients>) {
  const {
    body: { vtexIdToken, appKey, appToken, manager, validatedBody },
    vtex: { logger },
  } = ctx

  const responseManager = manager

  async function myOperations(
    elements: ResponseManager
  ): Promise<ResponseManager | void> {
    try {
      return await retryCall(ctx, operation, myOperations, elements)
    } catch (error) {
      buildServiceErrorResponse(error, ctx)
    }
  }

  try {
    logger.log(
      {
        message: 'massive-stock-update start 2',
        request: validatedBody.length,
      },
      LogLevel.Info
    )
    const itemsResponses: OperationResponse[] = await Promise.all(
      validatedBody.map(
        async (elem: {
          sku: number
          warehouseId: string
          quantity: number
          unlimitedQuantity: boolean
          dateUtcOnBalanceSystem: string
        }) => {
          const {
            sku,
            warehouseId,
            quantity,
            unlimitedQuantity,
            dateUtcOnBalanceSystem,
          } = elem

          const response = await operation(
            ctx,
            sku,
            warehouseId,
            quantity,
            unlimitedQuantity,
            dateUtcOnBalanceSystem,
            appKey,
            appToken,
            vtexIdToken
          )

          return response
        }
      )
    )

    itemsResponses.map((element) =>
      element.type === '429'
        ? responseManager.errors429.push(element.item)
        : responseManager.updateResponse.push(element.item)
    )
    const data = await myOperations(responseManager)

    if (data) {
      buildResponse(data, ctx)
    }
  } catch (error) {
    buildServiceErrorResponse(error, ctx)
  }
}
