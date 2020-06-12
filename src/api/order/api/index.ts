import { getOrdersRoute } from './getOrders'
import { combineRoutes } from '@marblejs/core'
import { AppConfig } from '@/api/config'

export const orderRoutes = (config: AppConfig) => combineRoutes('/order', [
  getOrdersRoute(config)
])
