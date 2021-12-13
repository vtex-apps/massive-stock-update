import { UserInputError } from '@vtex/api'
import { json } from 'co-body'

export async function validateMiddleware(
  ctx: Context,
  next: () => Promise<any>
) {
  const vtexIdToken = ctx.get('VtexIdclientAutCookie')
  const appKey = ctx.get('X-VTEX-API-AppKey')
  const appToken = ctx.get('X-VTEX-API-AppToken')

  if (vtexIdToken ? false : !(appKey !== '' && appToken !== '')) {
    ctx.status = 401
    ctx.body = 'Unauthorized access.'

    return
  }

  const requestList = await json(ctx.req)
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

    if (!quantity) {
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
        error: 400,
        errorMessage: `The request is invalid: The '${field}' field is required.`,
      }
    }
  }

  try {
    for (const request of requestList) {
      requestValidator(request)
    }
  } catch (error) {
    throw new UserInputError(error)
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
}
