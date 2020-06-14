import { forkJoin, pipe } from 'rxjs'
import { map, mergeMap, toArray } from 'rxjs/operators'
import { AppConfig } from '../../config'
import { countQuery, fromSqlQuery, SqlQuery, fromSqlScalar } from '../../db'
import { toPage, orderFields, instrumentFields } from '../../types'
import { GetOrdersRequest } from './types'
import { OrderAggregate } from '../../types'

const columns = (entity: string, obj: any, alias?: boolean) => Object
  .keys(obj)
  .map(col => alias
      ? `"${entity}".${col} AS "${entity}.${col}"`
      : `"${entity}".${col}`)
  .join(', ')

const toQuery = (req: GetOrdersRequest): SqlQuery<OrderAggregate> => ({
  name: 'fetch orders',
  text: `
SELECT
  ${columns("order", orderFields)},
  ${columns("instrument", instrumentFields, true)}
FROM "order"
  INNER JOIN instrument on instrument.id = "order".instrumentid
`,
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
