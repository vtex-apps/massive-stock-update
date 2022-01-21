import type { EventContext } from '@vtex/api'
import { LogLevel } from '@vtex/api'

import type { Clients } from '../../clients'

export const buildResponse = (
  responseManager: ResponseManager,
  ctx: EventContext<Clients>
): void => {
  const { updateResponse } = responseManager
  const {
    vtex: { logger },
  } = ctx

  const successfulResponses = updateResponse.filter((e) => {
    return e.success !== 'false'
  })

  const failedResponses = updateResponse.filter((e) => {
    return e.success === 'false'
  })

  const failedResponseData = JSON.stringify(failedResponses)

  logger.log(
    {
      message: 'massive-stock-update finish - buildResponse 2',
      total: updateResponse.length,
      successfulResponses: successfulResponses.length,
      failedResponse: failedResponses.length,
      failedResponseData,
    },
    LogLevel.Info
  )
}

export const buildErrorResponse = (
  responseManager: ResponseManager,
  ctx: EventContext<Clients>
): void => {
  const { updateResponse } = responseManager
  const {
    vtex: { logger },
  } = ctx

  /*   ctx.body = {
    failedResponses: {
      elements: updateResponse,
      quantity: updateResponse.length,
    },
  }
 */
  logger.log(
    {
      message: 'massive-stock-update finish - buildErrorResponse 2',
      total: updateResponse.length,
      successfulResponses: 0,
      failedResponse: updateResponse.length,
    },
    LogLevel.Info
  )
}

export const buildServiceErrorResponse = (
  error: string,
  ctx: EventContext<Clients>
): void => {
  /*   ctx.status = 500
  ctx.body = error */
  const {
    vtex: { logger },
  } = ctx

  logger.log(
    {
      message: 'massive-stock-update finish - buildServiceErrorResponse 2',
      errorMessage: {
        error,
      },
    },
    LogLevel.Info
  )
}

export const buildBadRequest = (
  sku: number,
  warehouseId: string,
  quantity: number,
  unlimitedQuantity: boolean,
  dateUtcOnBalanceSystem: string,
  option: number,
  field: string
  // eslint-disable-next-line max-params
): UpdateResponse => {
  const response: UpdateResponse = {
    sku,
    warehouseId,
    quantity,
    unlimitedQuantity,
    dateUtcOnBalanceSystem,
    success: 'false',
    error: '400',
  }

  if (option === 1) {
    response.errorMessage = `The request is invalid: The '${field}' field is required.`

    return response
  }

  response.errorMessage = `The request is invalid: field '${field}' must be a number.`

  return response
}
