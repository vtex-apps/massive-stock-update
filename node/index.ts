import type { ClientsConfig, ServiceContext, RecorderState } from '@vtex/api'
import { LRUCache, method, Service } from '@vtex/api'

import { Clients } from './clients'
import { testStock as myEvent } from './events/testStock'
import { manager } from './middlewares/manager'
import { validateMiddleware } from './middlewares/validateMiddleware'

const TIMEOUT_MS = 86400000

const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('status', memoryCache)

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      // retries: 2,
      timeout: TIMEOUT_MS,
      concurrency: 10,
    },

    status: {
      memoryCache,
    },
    events: {
      /*       exponentialBackoffCoefficient: 2,
      exponentialTimeoutCoefficient: 2,
      initialBackoffDelay: 50,
      retries: 1, */
      timeout: TIMEOUT_MS,
      concurrency: 10,
    },
  },
}

declare global {
  type Context = ServiceContext<Clients, State>

  interface State extends RecorderState {
    responseManager: ResponseManager
    validatedBody: UpdateRequest[]
  }
}

export default new Service({
  clients,
  routes: {
    status: method({
      PUT: [validateMiddleware, manager],
    }),
  },
  events: {
    testEvent: myEvent,
  },
})
