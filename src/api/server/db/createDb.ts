import { from, of, merge, throwError, pipe, identity, timer, OperatorFunction } from 'rxjs'
import { mergeMap, mergeMapTo, tap, catchError, mapTo, reduce, retryWhen, concatMap } from 'rxjs/operators'
import { Pool } from 'pg'
import { readFile } from '@etlx/operators/fs'
import { condition } from '@etlx/operators/core'

import { AppConfig } from '../config'
import { fromSqlCommand, SqlOptions, fromSqlQuery } from './opearators'
import { Order } from '../models/order'
import { orderFields, instrumentFields, certificateFields } from '../models/meta'
import { Instrument } from '../models/instrument'
import { Certificate } from '../models/certificate'

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

const retryCount = <T>(delay: number = 1000, attempts: number = 5): OperatorFunction<T, T> => {
  let count = attempts

  return retryWhen(xs => xs.pipe(
    concatMap(e => --count > 0 ? timer(delay) : throwError(e)),
  ))
}

const tryConnect = async (config: SqlOptions, attempts: number, delay: number) => {
  let pool = config.pool()
  try {
    await pool.connect().catch()
  } catch (e) {
    if (attempts > 1) {
      await sleep(delay)
      await tryConnect(config, attempts - 1, delay)
    } else {
      throw e
    }
  }
}

const canConnect = (config: SqlOptions) => from(tryConnect(config, 50, 1e3))

const createDatabase = (config: SqlOptions, name: string) => fromSqlCommand(config, {
  text: `CREATE DATABASE "${name}"`,
})

const dbExists = (config: SqlOptions, name: string) => fromSqlCommand(config, {
  text: 'SELECT datname FROM pg_catalog.pg_database WHERE datname = $1',
  values: [name],
})

const tableExists = (config: SqlOptions, name: string, fields: string[]) => fromSqlQuery(config, {
  text: `SELECT ${fields.join(',')} FROM "${name}" LIMIT 1`,
}).pipe(
  mapTo(true),
  catchError(() => of(false)),
)

const checkSchema = (config: SqlOptions) => {
  let order = tableExists(config, Order.name, orderFields)
  let instrument = tableExists(config, Instrument.name, instrumentFields)
  let certificate = tableExists(config, Certificate.name, certificateFields)

  return merge(order, instrument, certificate).pipe(
    reduce((a, b) => a && b, true),
  )
}

const tryRepairSchema = (config: AppConfig, sqlScriptPath: string) => checkSchema(config).pipe(
  condition(
    identity,
    pipe(
      tap(() => console.log('Database schema is ok')),
    ),
    pipe(
      tap(() => console.log('Database schema is out of sync. Trying to repare...')),
      mergeMapTo(initFromScript(config, sqlScriptPath)),
      retryCount(2e3, 5),
      tap(() => console.log('All done!\n')),
    ),
  )
)

const initFromScript = (config: AppConfig, path: string) => {
  let pool = () => new Pool(config.db)

  return readFile(path, { encoding: 'utf-8' }).pipe(
    mergeMap((text: string) => fromSqlCommand({ pool }, { text }))
  )
}

export const initDb = (sqlScriptPath: string, config: AppConfig) => {
  let name = config.db.database
  let pool = new Pool({
    ...config.db,
    database: undefined,
  })

  let opts: SqlOptions = { pool: () => pool }

  console.log('Checking if database exists...')

  return canConnect(opts).pipe(
    mergeMap(() => dbExists(opts, name)),
    tap(x => console.log(x ? 'Database Exists' : 'Creating new database...')),
    mergeMap(exists => exists
      ? tryRepairSchema(config, sqlScriptPath)
      : createDatabase(opts, name).pipe(
        tap(() => console.log('Database created. Running initialisation scripts...')),
        mergeMap(() => initFromScript(config, sqlScriptPath)),
        tap(() => console.log('All done!\n')),
      )),
  )
}
