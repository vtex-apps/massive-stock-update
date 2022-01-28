import { LogLevel } from '@vtex/api'

export async function managerCsv(ctx: Context, next: () => Promise<any>) {
  const {
    state: { validatedBody },
    vtex: { logger },
  } = ctx

  const responseManager: ResponseManager = {
    updateResponse: [],
    errors429: [],
  }

  console.info('managerCsv')
  try {
    logger.log(
      {
        message: 'managerCsv',
        request: validatedBody.length,
      },
      LogLevel.Info
    )

    const vtexIdToken = ctx.get('VtexIdclientAutCookie')
    const appKey = ctx.get('X-VTEX-API-AppKey')
    const appToken = ctx.get('X-VTEX-API-AppToken')

    // TODO: Crear key y value y mandar al evento en ves del validateBody.

    await ctx.clients.events.sendEvent('', 'csv-event', {
      validatedBody,
      vtexIdToken,
      appKey,
      appToken,
      manager: responseManager,
    })

    console.info('managerCsv finish')

    ctx.status = 200
    ctx.body = 'Process executed OK'
    await next()
  } catch (error) {
    console.info('error: ', error)
    logger.log(
      {
        message: 'massive-stock-update Manager Error',
        errorMessage: error,
      },
      LogLevel.Error
    )
  }
}
