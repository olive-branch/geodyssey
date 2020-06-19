import { combineRoutes } from '@marblejs/core'
import { AppConfig } from '../config'

import { getOrdersRoute } from './get/route'
import { getOrderByIdRoute } from './getById/route'

export default (config: AppConfig) => combineRoutes('/order', [
  getOrdersRoute(config),
  getOrderByIdRoute(config),
])
