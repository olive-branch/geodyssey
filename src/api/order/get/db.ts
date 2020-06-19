import { forkJoin, pipe, OperatorFunction } from 'rxjs'
import { map, mergeMap, toArray } from 'rxjs/operators'
import { fromSqlQuery, SqlQuery, fromSqlScalar, SqlScalar, columns, SqlOptions } from '../../db'
import { toPage, orderFields, instrumentFields, certificateFields } from '../../types'
import { GetOrdersRequest, GetOrdersResponse } from './types'
import { OrderAggregate } from '../../types'

const toQuery = (req: GetOrdersRequest): SqlQuery<OrderAggregate> => ({
  name: 'fetch orders',
  text: `
SELECT
  ${columns('o', orderFields)},
  ${columns('i', instrumentFields, 'instrument')},
  ${columns('c', certificateFields, 'certificate')},
  prev.sign AS "pastCertificateSign"
FROM "order" o
  INNER JOIN instrument i ON o.instrumentId = i.id
  LEFT JOIN LATERAL (
    SELECT *
    FROM certificate c
    WHERE c.instrumentId = i.id
      AND c.date >= o.arrivedAt
      AND (o.departedAt IS NULL OR c.date <= o.departedAt)
    ORDER BY c.date DESC
    FETCH FIRST 1 ROWS ONLY
  ) c ON true
  LEFT JOIN LATERAL (
    SELECT c.sign
    FROM certificate c
    WHERE c.instrumentId = i.id
    AND c.date < o.arrivedAt
    ORDER BY c.date DESC
    FETCH FIRST 1 ROWS ONLY
  ) prev ON true
ORDER BY o.arrivedToApproverAt DESC, o.updatedAt DESC
OFFSET $1 ROWS
FETCH FIRST $2 ROW ONLY
`,
  values: [req.offset, req.limit],
})

const toOffsetQuery = ({ year: yearOffset }: GetOrdersRequest): SqlScalar<string> => ({
  name: 'fetch orders offset by year',
  text: `SELECT COUNT(id) FROM "order" o WHERE date_part('year', o.arrivedToApproverAt) < $1`,
  values: [yearOffset],
})

const toCountQuery = (_: GetOrdersRequest): SqlScalar<string> => ({
  name: 'fetch orders count',
  text: 'SELECT COUNT(id) FROM "order"',
})

const toInt = (x: string) => parseInt(x, 10)

const fetchData = (opts: SqlOptions) => (req: GetOrdersRequest) => {
  let countQuery = toCountQuery(req)
  let query = toQuery(req)

  let items = fromSqlQuery(opts, query).pipe(toArray())
  let total = fromSqlScalar(opts, countQuery).pipe(map(toInt))

  return forkJoin({ total, items }).pipe(
    map(toPage(req)),
  )
}

export const getOrders = (opts: SqlOptions): OperatorFunction<GetOrdersRequest, GetOrdersResponse> => {
  let toData = fetchData(opts)

  return pipe(
    mergeMap(req => !req.year
      ? toData(req)
      : fromSqlScalar(opts, toOffsetQuery(req)).pipe(
        map(toInt),
        map(offset => <GetOrdersRequest>({ offset, limit: req.limit })),
        mergeMap(toData),
      )
    ),
  )
}
