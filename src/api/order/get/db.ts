import { forkJoin, pipe } from 'rxjs'
import { map, mergeMap, toArray } from 'rxjs/operators'
import { AppConfig } from '../../config'
import { countQuery, fromSqlQuery, SqlQuery, fromSqlScalar } from '../../db'
import { toPage } from '../../util'
import { GetOrdersRequest } from './types'
import { OrderAggregate } from '../../types'



const toQuery = (req: GetOrdersRequest): SqlQuery<OrderAggregate> => ({
  name: 'fetch orders',
  text: 'SELECT * FROM order INNER JOIN instrument on order.instrument = instrument.id',
  values: [],
})

export const getOrders = (opts: AppConfig) => pipe(
  mergeMap((req: GetOrdersRequest) => {
    let query = toQuery(req)

    let items = fromSqlQuery(opts, query).pipe(toArray())
    let total = fromSqlScalar(opts, countQuery(query))

    return forkJoin({ total, items }).pipe(
      map(toPage(req)),
    )
  }),
)
