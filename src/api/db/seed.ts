import { Instrument, Certificate, Order, OrderAggregate } from '../types'
import { from, merge } from 'rxjs'
import { reduce } from 'rxjs/operators'
import { SqlCommand, SqlOptions } from '.'
import { DATA } from './testData'

const insertCommand = <T>(table: string, columns: Array<keyof T>) => {
  let name = `insert-${table}`
  let keys = columns.map((_, i) => `$${i + 1}`)
  let text = `INSERT INTO "${table}" (${columns}) VALUES (${keys})`

  return (value: T): SqlCommand => ({
    name,
    text,
    values: columns.map(k => value[k] || null),
  })
}

const insertInstrumentCommand = insertCommand<Instrument>('instrument', [
  'id',
  'createdAt',
  'updatedAt',
  'model',
  'registry',
  'serial',
  'type',
])

const insertCertificateCommand = insertCommand<Certificate>('certificate', [
  'id',
  'createdAt',
  'updatedAt',
  'instrumentId',
  'comments',
  'date',
  'issuer',
  'number',
  'sign',
])

const insertOrderCommand = insertCommand<Order>('order', [
  'id',
  'createdAt',
  'updatedAt',
  'instrumentId',
  'bill',
  'client',
  'comments',
  'number',
  'service',
  'status',
  'arrivedAt',
  'arrivedToApproverAt',
  'deadlineAt',
  'departedAt',
])

const sequential = <T>(combine: (a: T, b: T) => T) => async (a: Promise<T>, b: () => Promise<T>) => {
  let prev = await a
  let next = await b()

  return combine(prev, next)
}

const sum = (a: number, b: number) => a + b

const toInsertCommands = (x: OrderAggregate): SqlCommand[] => {
  let cmds = [
    insertInstrumentCommand(x.instrument),
    x.certificate ? insertCertificateCommand(x.certificate) : undefined,
    insertOrderCommand(x)
  ]

  return cmds.filter(x => x !== undefined) as SqlCommand[]
}

export const seed = (data: OrderAggregate[] = DATA) => ({ pool }: SqlOptions) => {
  let obs = data.map(toInsertCommands).map(cmds => from(cmds
      .map(cmd => () => pool().query(cmd).then(x => x.rowCount))
      .reduce(sequential(sum), Promise.resolve(0))
    )
  )

  return merge(...obs).pipe(reduce(sum, 0))
}
