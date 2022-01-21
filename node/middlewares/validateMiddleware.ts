import { LogLevel, UserInputError } from '@vtex/api'
import { json } from 'co-body'

export async function validateMiddleware(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    vtex: { logger },
  } = ctx

  logger.log(
    {
      message: 'massive-stock-update validateMiddleware start 2',
    },
    LogLevel.Info
  )

  const vtexIdToken = ctx.get('VtexIdclientAutCookie')
  const appKey = ctx.get('X-VTEX-API-AppKey')
  const appToken = ctx.get('X-VTEX-API-AppToken')

  if (vtexIdToken ? false : !(appKey !== '' && appToken !== '')) {
    ctx.status = 401
    ctx.body = 'Unauthorized access.'
    logger.log(
      {
        message: 'massive-stock-update Error',
        errorMessage: 'Unauthorized access',
      },
      LogLevel.Error
    )

    return
  }

  const errorList: any[] = []

  function requestValidator(request: UpdateRequest): void {
    const requestErrorList: UpdateResponse[] = []

    const {
      sku,
      warehouseId,
      quantity,
      unlimitedQuantity,
      dateUtcOnBalanceSystem,
    } = request

    if (!sku) {
      requestErrorList.push(errorResponseGenerator('sku'))
    }

    if (!warehouseId) {
      requestErrorList.push(errorResponseGenerator('warehouseId'))
    }

    if (typeof quantity === undefined || typeof quantity !== 'number') {
      requestErrorList.push(errorResponseGenerator('quantity'))
    }

    if (typeof unlimitedQuantity === 'undefined') {
      requestErrorList.push(errorResponseGenerator('unlimitedQuantity'))
    }

    if (typeof dateUtcOnBalanceSystem === 'undefined') {
      requestErrorList.push(errorResponseGenerator('dateUtcOnBalanceSystem'))
    }

    if (requestErrorList.length >= 1) {
      errorList.push(requestErrorList)
    }

    function errorResponseGenerator(field: string): UpdateResponse {
      return {
        sku,
        warehouseId,
        quantity,
        unlimitedQuantity,
        dateUtcOnBalanceSystem,
        success: 'false',
        error: '400',
        errorMessage: `The request is invalid: The '${field}' field is required.`,
      }
    }
  }

  try {
    const requestList = await json(ctx.req)

    for (const request of requestList) {
      requestValidator(request)
    }

    if (errorList.length >= 1) {
      ctx.status = 400
      ctx.body = {
        failedResponses: {
          elements: errorList,
          quantity: errorList.length,
        },
      }

      return
    }

    ctx.state.validatedBody = requestList
    await next()
  } catch (error) {
    logger.log(
      {
        message: 'massive-stock-update ValidateMiddleware Error',
        errorMessage: error,
      },
      LogLevel.Error
    )
    throw new UserInputError(error)
  }
}
