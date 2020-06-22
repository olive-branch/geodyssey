import { SqlOptions, SqlCommand, fromSqlTransaction } from '../../server/db/opearators'
import { pipe, OperatorFunction } from 'rxjs'
import { UpdateOrderRequest, UpdateOrderResponse } from './types'
import { map, mergeMap, mapTo } from 'rxjs/operators'
import { Obj } from '../../../utils'


type State = { fields: string[], values: any[] }
const fieldsReducer = (acc: State, [k, v]: [string, any], i: number): State => {
  let key = k.toLowerCase()
  let variable = `$${i + 2}`

  return {
    fields: [...acc.fields, `"${key}" = ${variable}`],
    values: [...acc.values, v],
  }
}

const isScalar = (x: any) =>
  x instanceof Date ||
  typeof x === 'boolean' ||
  typeof x === 'number' ||
  typeof x === 'string' ||
  x === null

const toUpdateStatement = (entity: string, x: Obj | undefined): SqlCommand | null => {
  if (x === undefined) {
    return null
  }

  let { fields, values } = Object
    .entries(x)
    .filter(([_, v]) => isScalar(v))
    .reduce(fieldsReducer, { fields: [] as string[], values: [] as any[] })

  if (fields.length === 0) {
    return null
  }

  return {
    values: [x.id, ...values],
    text: `UPDATE "${entity}" SET ${fields.join(', ')} WHERE id = $1`,
  }
}

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
