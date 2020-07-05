import { OperatorFunction, pipe } from 'rxjs'
import { SqlOptions, fromSqlQuery, SqlQuery, columns } from '../../server/db/opearators'
import { orderFields, instrumentFields, certificateFields } from '../../server/models/meta'
import { GetOrderByIdRequest, GetOrderByIdResponse } from './types'
import { mergeMap, defaultIfEmpty } from 'rxjs/operators'
import { selectActiveCert, selectPastCert } from '../../server/queries/certificate'

const toQuery = (x: GetOrderByIdRequest): SqlQuery => ({
  name: 'fetch order by id',
  text: `
SELECT
  ${columns('o', orderFields)},
  ${columns('i', instrumentFields, 'instrument')},
  ${columns('c', certificateFields, 'certificate')},
  prev.sign AS "pastCertificateSign"
FROM "order" o
  INNER JOIN instrument i ON o.instrumentId = i.id
  LEFT JOIN LATERAL (${selectActiveCert}) c ON true
  LEFT JOIN LATERAL (${selectPastCert}) prev ON true
WHERE o.id = $1
`,
  values: [x.id],
})

export const queryOrderById = (opts: SqlOptions): OperatorFunction<GetOrderByIdRequest, GetOrderByIdResponse> => pipe(
  mergeMap(x => fromSqlQuery<GetOrderByIdResponse>(opts, toQuery(x))),
  defaultIfEmpty(null),
)
