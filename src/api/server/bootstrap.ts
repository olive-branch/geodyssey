import { httpListener } from '@marblejs/core'
import { logger$ } from '@marblejs/middleware-logger'
import { bodyParser$, urlEncodedParser, jsonParser } from '@marblejs/middleware-body'
import { AppConfig } from './config'
import { appRoutes } from './routes'

export const createHttpListener = (config: AppConfig) => httpListener({
  effects: appRoutes(config),
  middlewares: [
    logger$({ silent: false, filter: () => true }),
    bodyParser$({
      parser: urlEncodedParser,
      type: ['*/x-www-form-urlencoded'],
    }),
    bodyParser$({
      parser: jsonParser,
      type: ['*/json', 'application/vnd.api+json'],
    }),
  ],
})


