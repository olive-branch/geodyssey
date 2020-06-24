import { SqlOptions, SqlCommand, fromSqlTransaction } from '../../server/db/opearators'
import { pipe, OperatorFunction } from 'rxjs'
import { AddOrderRequest, AddOrderResponse } from './types'
import { mergeMap, mapTo } from 'rxjs/operators'
import { OrderAggregate } from '../../types'
import { v4 as uuid } from 'uuid'
import { toInsertStatement } from '../../server/db/sql'


const toCommands = (req: OrderAggregate): SqlCommand[] => {
  let commands = [
    toInsertStatement('instrument', req.instrument),
    toInsertStatement('certificate', req.certificate),
    toInsertStatement('order', req),
  ]

  return commands.filter(x => x !== null) as SqlCommand[]
}

const normalizeRequest = (x: AddOrderRequest): OrderAggregate => {
  let createdAt = new Date()
  let updatedAt = createdAt

  let instrumentId = uuid()

  return {
    ...x,
    id: uuid(),
    createdAt,
    updatedAt,
    instrumentId,
    instrument: {
      ...x.instrument,
      id: instrumentId,
      createdAt,
      updatedAt,
    },
    certificate: x.certificate === undefined ? undefined : {
      ...x.certificate,
      id: uuid(),
      createdAt,
      updatedAt,
      instrumentId,
    },
  }
}

export const addOrderHandler = (config: SqlOptions): OperatorFunction<AddOrderRequest, AddOrderResponse> => pipe(
  mergeMap((req) => {
    let order = normalizeRequest(req)
    let commands = toCommands(order)

    return fromSqlTransaction(config, commands).pipe(mapTo(order))
  }),
)
