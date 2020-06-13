import { combineRoutes } from '@marblejs/core'
import { AppConfig } from '../config'

import { getOrdersRoute } from './get/handler'

export default (config: AppConfig) => combineRoutes('/order', [
  getOrdersRoute(config)
])
