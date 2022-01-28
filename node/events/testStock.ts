import type { EventContext } from '@vtex/api'
import { LogLevel } from '@vtex/api'

import type { Clients } from '../clients'
import {
  buildResponse,
  buildServiceErrorResponse,
  operation,
  retryCall,
  sleep,
} from './utils'

async function myOperations(
  ctx: EventContext<Clients>,
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
    body: { vtexIdToken, appKey, appToken, manager, validatedBody, requestId },
    vtex: { logger },
    clients: { vbase },
  } = ctx

  logger.log(
    {
      message: 'testEvent function testStock 1',
      request: validatedBody.length,
    },
    LogLevel.Info
  )

  const responseManager = manager

  try {
    logger.log(
      {
        message: 'testEvent function testStock 2',
        request: validatedBody.length,
      },
      LogLevel.Info
    )

    try {
      const responseVbase = await vbase.getJSON('massivestock', requestId)

      logger.log(
        {
          message: 'testEvent function evento ya ejecutado',
          requestId,
          responseVbase,
        },
        LogLevel.Info
      )
    } catch (error) {
      if (error.response.status === 404) {
        const updateProcess: UpdateProcess = {
          list: validatedBody,
          requestId,
        }

        const newHash = Buffer.from(JSON.stringify(updateProcess)).toString(
          'base64'
        )

        const vbaseData = await vbase.saveJSON(
          'massivestock',
          requestId,
          newHash
        )

        logger.log(
          {
            message: 'testEvent function saveJSON in vBase',
            vbaseData,
          },
          LogLevel.Info
        )

        const itemsResponses: OperationResponse[] = []

        for (let i = 0; i < validatedBody.length; i++) {
          const {
            sku,
            warehouseId,
            quantity,
            unlimitedQuantity,
            dateUtcOnBalanceSystem,
          } = validatedBody[i]

          // eslint-disable-next-line no-await-in-loop
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

          itemsResponses.push(response)
          sleep('0.1')
        }

        itemsResponses.map((element) =>
          element.type === '429'
            ? responseManager.errors429.push(element.item)
            : responseManager.updateResponse.push(element.item)
        )
        const data = await myOperations(ctx, responseManager)

        logger.log(
          {
            message: 'testEvent function testStock 3',
          },
          LogLevel.Info
        )

        if (data) {
          const updateprocessRemoved = await vbase.deleteFile(
            'massivestock',
            requestId
          )

          logger.log(
            {
              message: 'testEvent function deleteJSON in vBase',
              updateprocessRemoved,
            },
            LogLevel.Info
          )
          buildResponse(data, requestId, ctx)
        } else {
          logger.log(
            {
              message: 'testEvent function no entro al buildResponse',
              dataResponse: data,
            },
            LogLevel.Info
          )
        }
      } else {
        throw error
      }
    }
  } catch (error) {
    logger.log(
      {
        message: 'testEvent function testStock 4',
        request: error,
      },
      LogLevel.Error
    )
    buildServiceErrorResponse(error, ctx)
  }
}
