import type { EventContext } from '@vtex/api'
import { LogLevel } from '@vtex/api'

import type { Clients } from '../clients'
import {
  buildResponse,
  buildServiceErrorResponse,
  operation,
  retryCall,
} from './utils'

async function myOperations(
  ctx: any,
  elements: ResponseManager
): Promise<ResponseManager | void> {
  try {
    return await retryCall(ctx, operation, myOperations, elements)
  } catch (error) {
    buildServiceErrorResponse(error, ctx)
  }
}

export async function testStock(ctx: EventContext<Clients>) {
  const {
    body: { vtexIdToken, appKey, appToken, manager, validatedBody },
    vtex: { logger },
  } = ctx

  logger.log(
    {
      message: 'testEvent function testStock',
      request: validatedBody.length,
    },
    LogLevel.Info
  )

  const responseManager = manager

  try {
    logger.log(
      {
        message: 'testEvent function testStock2',
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
    const data = await myOperations(ctx, responseManager)

    logger.log(
      {
        message: 'testEvent function testStock 3',
        request: data,
      },
      LogLevel.Info
    )

    if (data) {
      buildResponse(data, ctx)
    }
  } catch (error) {
    logger.log(
      {
        message: 'testEvent function testStock 4',
        request: error,
      },
      LogLevel.Info
    )
    buildServiceErrorResponse(error, ctx)
  }
}
