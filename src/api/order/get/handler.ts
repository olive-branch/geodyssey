import { r } from '@marblejs/core'
import { map } from 'rxjs/operators'

import { AppConfig } from '../../config'
import { getOrders } from './db'
import { GetOrdersRequest } from './types'


export const getOrdersRoute = (config: AppConfig) => r.pipe(
  r.matchPath('/'),
  r.matchType('GET'),
  r.useEffect($ => $.pipe(
      map(() => ({ } as GetOrdersRequest)),
      getOrders(config),
      map(body => ({ body }))
  )),
)
