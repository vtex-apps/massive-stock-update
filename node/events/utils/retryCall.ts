import type { EventContext } from '@vtex/api'
import { LogLevel } from '@vtex/api'

import type { Clients } from '../../clients'
import { setTimeOutValue } from './setTimeOutValue'
import { sleep } from './sleep'

export const retryCall = async (
  ctx: EventContext<Clients>,
  operation: (
    ctx: EventContext<Clients>,
    sku: number,
    warehouseId: string,
    quantity: number,
    unlimitedQuantity: boolean,
    dateUtcOnBalanceSystem: string,
    appKey: string,
    appToken: string,
    vtexIdToken: string
  ) => Promise<OperationResponse>,
  retry: (
    ctx: any,
    responseManager: ResponseManager
  ) => Promise<ResponseManager | void>,
  responseManager: ResponseManager
  // eslint-disable-next-line max-params
): Promise<ResponseManager | void> => {
  const {
    vtex: { logger },
  } = ctx

  logger.log(
    {
      message: 'retryCall 1',
      responseManager: {
        errors429: responseManager.errors429.length,
        updateResponses: responseManager.updateResponse.length,
      },
    },
    LogLevel.Info
  )
  if (responseManager.errors429.length >= 1) {
    /*    logger.log(
      {
        message:
          'massive-stock-update - retryCall Entro al flujo de reintento 429',
        responseManager: {
          errors429: responseManager.errors429.length,
          updateResponses: responseManager.updateResponse.length,
        },
      },
      LogLevel.Info
    ) */

    let value = '0'

    const retryList = responseManager.errors429

    for (const index in responseManager.errors429) {
      const errorResponse = responseManager.errors429[index]

      if (errorResponse.errorMessage && errorResponse.errorMessage > value) {
        value = errorResponse.errorMessage
      }
    }

    if (value === '0') {
      value = await setTimeOutValue(ctx, value)
    }

    await sleep(value)

    responseManager.errors429 = []

    const itemsResponses: OperationResponse[] = await Promise.all(
      retryList.map(async (item) => {
        const {
          sku,
          warehouseId,
          quantity,
          unlimitedQuantity,
          dateUtcOnBalanceSystem,
        } = item

        const {
          body: { vtexIdToken, appKey, appToken },
        } = ctx

        return operation(
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
      })
    )

    itemsResponses.map((element) =>
      element.type === '429'
        ? responseManager.errors429.push(element.item)
        : responseManager.updateResponse.push(element.item)
    )

    return retry(ctx, responseManager)
  }

  logger.log(
    {
      message: 'retryCall 2',
      responseManager: {
        errors429: responseManager.errors429.length,
        updateResponses: responseManager.updateResponse.length,
      },
    },
    LogLevel.Info
  )

  return responseManager
}
