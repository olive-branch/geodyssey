import { SqlOptions, fromSqlQuery, SqlQuery, columns } from "../../db";
import { OperatorFunction, pipe } from "rxjs";
import { OrderAggregate, orderFields, instrumentFields, certificateFields } from "../../types";
import { GetOrderByIdRequest } from "./types";
import { mergeMap } from "rxjs/operators";

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
WHERE o.id = $1
`,
  values: [x.id],
})

export const getOrderById = (opts: SqlOptions): OperatorFunction<GetOrderByIdRequest, OrderAggregate> => pipe(
  mergeMap(x => fromSqlQuery<OrderAggregate>(opts, toQuery(x))),
)
