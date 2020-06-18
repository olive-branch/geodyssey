import { r, HttpRequest } from '@marblejs/core'
import { map } from 'rxjs/operators'

import { AppConfig } from '../../config'
import { getOrders } from './db'
import { GetOrdersRequest } from './types'

type GetOrdersQuery = {
  limit?: string,
  offset?: string,
}

export const getOrdersRoute = (config: AppConfig) => r.pipe(
  r.matchPath('/'),
  r.matchType('GET'),
  r.useEffect($ => $.pipe(
      map((req: HttpRequest<void, void, GetOrdersQuery>) => {
        let limit = parseInt(req.query.limit!, 10) || 20
        let offset = parseInt(req.query.offset!, 10) || 0

        return <GetOrdersRequest>{ limit, offset }
      }),
      getOrders(config),
      map(body => ({ body }))
  )),
)
