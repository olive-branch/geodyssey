import { combineRoutes } from '@marblejs/core'
import { AppConfig } from './config'

import { autocompleteRoute } from '../autocomplete/route'
import { getOrdersRoute } from '../order/get/route'
import { getOrderByIdRoute } from '../order/getById/route'
import { deleteOrderRoute } from '../order/delete/route'

export const appRoutes = (config: AppConfig) => [
  combineRoutes('/api', [
    combineRoutes('/order', [
      getOrdersRoute(config),
      getOrderByIdRoute(config),
      deleteOrderRoute(config),
    ]),
    autocompleteRoute(config),
  ]),
]
