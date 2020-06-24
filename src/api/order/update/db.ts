import { SqlOptions, SqlCommand, fromSqlTransaction } from '../../server/db/opearators'
import { pipe, OperatorFunction } from 'rxjs'
import { UpdateOrderRequest, UpdateOrderResponse } from './types'
import { map, mergeMap, mapTo } from 'rxjs/operators'
import { toUpdateStatement } from '../../server/db/sql'


const toCommands = (req: UpdateOrderRequest): SqlCommand[] => {
  let commands = [
    toUpdateStatement('order', req),
    toUpdateStatement('instrument', req.instrument),
    toUpdateStatement('certificate', req.certificate)
  ]

  return commands.filter(x => x !== null) as SqlCommand[]
}

const normalizeRequest = (x: UpdateOrderRequest): UpdateOrderRequest => {
  let updatedAt = new Date()
  let createdAt = undefined

  return {
    ...x,
    createdAt,
    updatedAt,
    instrument: x.instrument === undefined ? undefined : {
      ...x.instrument,
      createdAt,
      updatedAt,
    },
    certificate: x.certificate === undefined ? undefined : {
      ...x.certificate,
      createdAt,
      updatedAt,
    },
  }
}

export const updateOrderHandler = (config: SqlOptions): OperatorFunction<UpdateOrderRequest, UpdateOrderResponse> => pipe(
  map(normalizeRequest),
  map(toCommands),
  mergeMap(x => fromSqlTransaction(config, x)),
  mapTo(undefined),
)
