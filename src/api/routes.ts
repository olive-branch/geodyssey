import { combineRoutes } from '@marblejs/core'
import { AppConfig } from './config'

import { orderRoutes } from './order/api'

export const appRoutes = (config: AppConfig) => [
  combineRoutes('/api', [
    orderRoutes(config)
  ]),
]
