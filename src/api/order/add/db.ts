import { SqlOptions, SqlCommand, fromSqlTransaction } from '../../server/db/opearators'
import { pipe, OperatorFunction } from 'rxjs'
import { AddOrderRequest, AddOrderResponse } from './types'
import { map, mergeMap, mapTo } from 'rxjs/operators'
import { Obj } from '../../../utils'
import { OrderAggregate } from '../../types'
import { v4 as uuid } from 'uuid'


type State = { fields: string[], variables: string[], values: any[] }
const initState: State = { fields: [], variables: [], values: [] }
const fieldsReducer = (acc: State, [k, v]: [string, any], i: number): State => {
  let key = k.toLowerCase()

  return {
    fields: [...acc.fields, `"${key}"`],
    variables: [...acc.variables,  `$${i + 1}`],
    values: [...acc.values, v],
  }
}

const isScalar = (x: any) =>
  x instanceof Date ||
  typeof x === 'boolean' ||
  typeof x === 'number' ||
  typeof x === 'string' ||
  x === null

const toInsertStatement = (entity: string, x: Obj | undefined): SqlCommand | null => {
  if (x === undefined) {
    return null
  }

  let { fields, variables, values } = Object
    .entries(x)
    .filter(([_, v]) => isScalar(v))
    .reduce(fieldsReducer, initState)

  if (fields.length === 0) {
    return null
  }

  return {
    values: values,
    text: `INSERT INTO "${entity}" (${fields.join(', ')}) VALUES (${variables.join(', ')})`,
  }
}

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
