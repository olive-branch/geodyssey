import { forkJoin, pipe } from 'rxjs'
import { map, mergeMap, toArray } from 'rxjs/operators'
import { AppConfig } from '../../config'
import { countQuery, fromSqlQuery, SqlQuery, fromSqlScalar } from '../../db'
import { Order, Instrument, PaginatedRequest, PaginatedResponse } from '../../types'
import { toPage } from '../../util'

export type GetOrdersRequest = PaginatedRequest & {
  sort?: string[],
  filter?: Partial<GetOrdersEntity>,
}

export type GetOrdersEntity = Order & {
  instrument: Instrument,
}

export type GetOrderResponse = PaginatedResponse<GetOrdersEntity>

const toQuery = (req: GetOrdersRequest): SqlQuery<GetOrdersEntity> => ({
  name: 'fetch orders',
  text: 'SELECT * FROM order INNER JOIN instrument on order.instrument = instrument.id',
  values: [],
})

export const getOrders = (opts: AppConfig) => pipe(
  mergeMap((req: GetOrdersRequest) => {
    let query = toQuery(req)

    let data = fromSqlQuery(opts, query).pipe(toArray())
    let count = fromSqlScalar(opts, countQuery(query))

    return forkJoin({ data, count }).pipe(
      map(toPage(req)),
    )
  }),
)
