import { SqlOptions, SqlCommand, fromSqlTransaction } from '../../server/db/opearators'
import { pipe, OperatorFunction } from 'rxjs'
import { AddOrderRequest, AddOrderResponse } from './types'
import { mergeMap, mapTo } from 'rxjs/operators'
import { OrderAggregate } from '../../types'

import { toInsertStatement } from '../../server/queries/upsert'
import { model } from '../../server/models/meta'



const toCommands = (req: OrderAggregate): SqlCommand[] => {
  let commands = [
    toInsertStatement('instrument', req.instrument),
    toInsertStatement('certificate', req.certificate),
    toInsertStatement('order', req),
  ]

  return commands.filter(x => x !== null) as SqlCommand[]
}

const normalizeRequest = (x: AddOrderRequest): OrderAggregate => {
  let instrument = model()

  return {
    ...x,
    ...model(),
    instrumentId: instrument.id,
    instrument: {
      ...x.instrument,
      ...instrument,
    },
    certificate: x.certificate === undefined ? undefined : {
      ...x.certificate,
      ...model(),
      instrumentId: instrument.id,
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
