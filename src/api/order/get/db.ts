import { forkJoin, pipe } from 'rxjs'
import { map, mergeMap, toArray } from 'rxjs/operators'
import { AppConfig } from '../../config'
import { fromSqlQuery, SqlQuery, fromSqlScalar, SqlScalar, columns } from '../../db'
import { toPage, orderFields, instrumentFields, certificateFields } from '../../types'
import { GetOrdersRequest } from './types'
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

const countQuery: SqlScalar<string> = ({
  name: 'fetch orders count',
  text: 'SELECT COUNT(id) FROM "order"',
})

export const getOrders = (opts: AppConfig) => pipe(
  mergeMap((req: GetOrdersRequest) => {
    let query = toQuery(req)

    let items = fromSqlQuery(opts, query).pipe(toArray())
    let total = fromSqlScalar(opts, countQuery).pipe(map(x => parseInt(x, 10)))

    return forkJoin({ total, items }).pipe(
      map(toPage(req)),
    )
  }),
)
