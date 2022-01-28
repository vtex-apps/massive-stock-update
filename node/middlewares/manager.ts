import { LogLevel } from '@vtex/api'

export async function manager(ctx: Context, next: () => Promise<void>) {
  const {
    state: { validatedBody },
    vtex: { logger, requestId },
  } = ctx

  const responseManager: ResponseManager = {
    updateResponse: [],
    errors429: [],
  }

  try {
    logger.log(
      {
        message: 'manager',
        request: validatedBody.length,
        requestId,
      },
      LogLevel.Info
    )

    console.info({
      message: 'manager',
      request: validatedBody.length,
      requestId,
    })
    const vtexIdToken = ctx.get('VtexIdclientAutCookie')
    const appKey = ctx.get('X-VTEX-API-AppKey')
    const appToken = ctx.get('X-VTEX-API-AppToken')

    await ctx.clients.events.sendEvent('', 'send-event', {
      validatedBody,
      vtexIdToken,
      appKey,
      appToken,
      manager: responseManager,
      requestId,
    })

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
    ctx.status = error.response.status
    await next()
  }
}
