import { combineRoutes } from '@marblejs/core'
import { AppConfig } from './config'

import orderRoutes from './order/routes'
import { autocompleteRoute } from './autocomplete/route'

export const appRoutes = (config: AppConfig) => [
  combineRoutes('/api', [
    orderRoutes(config),
    autocompleteRoute(config),
  ]),
]
