import { forkJoin, pipe, OperatorFunction, Observable } from 'rxjs'
import { map, mergeMap, toArray } from 'rxjs/operators'

import { toPage } from '../../utils/paging'
import { certificateFields, instrumentFields, orderFields } from '../../server/models/meta'
import { fromSqlQuery, SqlQuery, SqlScalar, columns, SqlOptions, fromSqlCount } from '../../server/db/opearators'
import { selectActiveCert } from '../../server/queries/certificate'
import { OrderAggregate } from '../../types'
import { GetOrdersRequest, GetOrdersResponse } from './types'


const searchExpression = (n: number) => [
  'o.bill',
  'o.client',
  'o.comments',
  'o.number',
  'o.service',
  'i.model',
  'i.serial',
  'i.type',
  'i.registry',
  'c.comments',
  'c.issuer',
  'c.sign',
  'c.number',
].map(field => `LOWER(${field}) LIKE $${n}`).join(' OR ')

const limitOffset = (n1: number, n2: number) => `
OFFSET $${n1} ROWS
FETCH FIRST $${n2} ROW ONLY`

const orderBy = () => `
ORDER BY o.arrivedToApproverAt DESC, o.updatedAt DESC`

const selectFrom = `
SELECT
  ${columns('o', orderFields)},
  ${columns('i', instrumentFields, 'instrument')},
  ${columns('c', certificateFields, 'certificate')}
FROM "order" o
  INNER JOIN instrument i ON o.instrumentId = i.id
  LEFT JOIN LATERAL (${selectActiveCert}) c ON true`

const selectFromWhere = (n: number, hasQuery: any) => `
${selectFrom}
${hasQuery ? `WHERE ${searchExpression(n)}` : ''}
`

const toOffsetQuery = (req: GetOrdersRequest): SqlScalar<string> => {
  let hasQuery = !!req.query
  let name = hasQuery ? 'search orders offset' : 'list orders offset'
  let values = hasQuery ? [req.year, req.query] : [req.year]
  let source = hasQuery
    ? selectFromWhere(2, req.query)
    : `SELECT ${columns('o', orderFields)} FROM "order" o`

  let text = `
SELECT COUNT(o.id)
FROM (
  ${source}
  ${orderBy()}
) o
WHERE date_part('year', o."arrivedToApproverAt") > $1`

  return { name, values, text }
}

const toCountQuery = (req: GetOrdersRequest): SqlScalar<string> => req.query ? ({
  name: 'search orders count',
  values: [req.query],
  text: `SELECT COUNT(q.id) FROM (${selectFromWhere(1, req.query)}) q`,
}) : ({
  name: 'list order count',
  text: `SELECT COUNT(id) FROM "order"`,
})

const toYearsQuery = (req: GetOrdersRequest): SqlQuery<{ year: number }> => {
  let name = `select orders years${req.query ? ' by query' : ''}`
  let values = req.query ? [req.query] : []

  let dateField = req.query ? '"arrivedToApproverAt"' : 'arrivedToApproverAt'
  let select = `SELECT DISTINCT date_part('year', o.${dateField}) as year`
  let from = req.query ? `FROM (${selectFromWhere(1, req.query)}) o` : `FROM "order" o`
  let orderBy = 'ORDER BY year DESC'
  let text = `${select}\n${from}\n${orderBy}`

  return { name, values, text }
}

const toDataQuery = (req: GetOrdersRequest): SqlQuery<OrderAggregate> => ({
  name: req.query ? 'search orders' : 'list orders',
  values: req.query ? [req.offset, req.limit, req.query] : [req.offset, req.limit],
  text: [
    selectFromWhere(3, req.query),
    orderBy(),
    limitOffset(1, 2)
  ].join(''),
})

const fetchData = (opts: SqlOptions) => (req: GetOrdersRequest): Observable<GetOrdersResponse> => {
  let countQuery = toCountQuery(req)
  let query = toDataQuery(req)
  let yearsQuery = toYearsQuery(req)

  let items = fromSqlQuery(opts, query).pipe(toArray())
  let years = fromSqlQuery(opts, yearsQuery).pipe(map(x => x.year), toArray())
  let total = fromSqlCount(opts, countQuery)

  return forkJoin({ total, items, years }).pipe(
    map(toPage(req)),
  )
}

export const queryOrders = (opts: SqlOptions): OperatorFunction<GetOrdersRequest, GetOrdersResponse> => {
  let toData = fetchData(opts)

  let toPatternQuery = (req: GetOrdersRequest): GetOrdersRequest => ({
    ...req,
    query: req.query ? `%${req.query.toLowerCase()}%` : undefined,
  })

  return pipe(
    map(toPatternQuery),
    mergeMap(req => !req.year
      ? toData(req)
      : fromSqlCount(opts, toOffsetQuery(req)).pipe(
        map(offset => <GetOrdersRequest>({ ...req, offset })),
        mergeMap(toData),
      )
    ),
  )
}
