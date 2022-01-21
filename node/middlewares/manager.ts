import { LogLevel } from '@vtex/api'

export async function manager(ctx: Context, next: () => Promise<any>) {
  const {
    state: { validatedBody },
    vtex: { logger },
  } = ctx

  const responseManager: ResponseManager = {
    updateResponse: [],
    errors429: [],
  }

  try {
    logger.log(
      {
        message: 'massive-stock-update start manager',
        request: validatedBody.length,
      },
      LogLevel.Info
    )

    const vtexIdToken = ctx.get('VtexIdclientAutCookie')
    const appKey = ctx.get('X-VTEX-API-AppKey')
    const appToken = ctx.get('X-VTEX-API-AppToken')

    ctx.clients.events.sendEvent('', 'send-event', {
      validatedBody,
      vtexIdToken,
      appKey,
      appToken,
      manager: responseManager,
    })

    ctx.status = 200
    ctx.body = 'Process executed OK'
    await next()
  } catch (error) {
    logger.log(
      {
        message: 'massive-stock-update Manager Error',
        errorMessage: error,
      },
      LogLevel.Error
    )
    ctx.status = 500
    await next()
  }
}
