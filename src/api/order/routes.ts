import { combineRoutes } from '@marblejs/core'
import { AppConfig } from '../config'

import { getOrdersRoute } from './get/handler'
import { getOrderByIdRoute } from './getById/handler'

export default (config: AppConfig) => combineRoutes('/order', [
  getOrdersRoute(config),
  getOrderByIdRoute(config),
])
