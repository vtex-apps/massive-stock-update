import type { EventContext } from '@vtex/api'

import type { Clients } from '../../clients'

export const setTimeOutValue = async (
  ctx: EventContext<Clients>,
  value: string
): Promise<string> => {
  const appId = process.env.VTEX_APP_ID ? process.env.VTEX_APP_ID : ''
  const { timeOutDefault } = await ctx.clients.apps.getAppSettings(appId)

  value =
    timeOutDefault !== undefined &&
    /^\d+$/.test(timeOutDefault) &&
    timeOutDefault > '10'
      ? timeOutDefault
      : '10'

  return value
}
