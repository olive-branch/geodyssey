import { Instrument, Certificate, Order } from '../../types'
import { instrumentFields, certificateFields, orderFields } from '../../server/models/meta'
import { from, concat } from 'rxjs'
import { reduce, mergeMap } from 'rxjs/operators'
import { SqlCommand, SqlOptions } from './opearators'
import { AppData, DB } from './testData'

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

const insertInstrumentCommand = insertCommand<Instrument>('instrument', instrumentFields as any)

const insertCertificateCommand = insertCommand<Certificate>('certificate', certificateFields as any)

const insertOrderCommand = insertCommand<Order>('order', orderFields as any)

const sum = (a: number, b: number) => a + b

const insert = ({ pool }: SqlOptions, commands: SqlCommand[]) => from(commands).pipe(
  mergeMap(x => pool().query(x).then(x => x.rowCount)),
)

export const seed = (data: AppData = DB) => (opts: SqlOptions) => {
  let instruments$ = insert(opts, data.instruments.map(insertInstrumentCommand))
  let certs$ = insert(opts, data.certificates.map(insertCertificateCommand))
  let orders$ = insert(opts, data.orders.map(insertOrderCommand))

  return concat(instruments$, certs$, orders$).pipe(reduce(sum, 0))
}
