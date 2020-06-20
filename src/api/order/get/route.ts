import { r, HttpRequest } from '@marblejs/core'
import { map } from 'rxjs/operators'

import { AppConfig } from '../../config'
import { queryOrders } from './db'
import { GetOrdersRequest } from './types'

type GetOrdersQuery = {
  limit?: string,
  offset?: string,
  year?: string,
  query?: string,
}

export const getOrdersRoute = (config: AppConfig) => r.pipe(
  r.matchPath('/'),
  r.matchType('GET'),
  r.useEffect($ => $.pipe(
      map((req: HttpRequest<void, void, GetOrdersQuery>) => {
        let limit = parseInt(req.query.limit!, 10) || 20
        let offset = parseInt(req.query.offset!, 10) || 0
        let year = parseInt(req.query.year!, 10) || undefined
        let query = req.query.query

        return <GetOrdersRequest>{ limit, offset, year, query }
      }),
      queryOrders(config),
      map(body => ({ body }))
  )),
)
