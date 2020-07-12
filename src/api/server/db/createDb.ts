import { AppConfig } from '../config'
import { Pool } from 'pg'
import { fromSqlCommand, SqlOptions } from './opearators'
import { mergeMap, mergeMapTo, tap } from 'rxjs/operators'
import { empty, from } from 'rxjs'
import { readFile } from '@etlx/operators/fs'

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

const tryConnect = async (config: SqlOptions, attempts: number, delay: number) => {
  let pool = config.pool()
  try {
    await pool.connect()
  } catch (e) {
    if (attempts > 1) {
      await sleep(delay)
      await tryConnect(config, attempts - 1, delay)
    } else {
      throw e
    }
  }
}

const canConnect = (confg: SqlOptions) => from(tryConnect(confg, 50, 1e3))


const createDatabase = (config: SqlOptions, name: string) => fromSqlCommand(config, {
  text: `CREATE DATABASE "${name}"`,
})

const dbExists = (config: SqlOptions, name: string) => fromSqlCommand(config, {
  text: 'SELECT datname FROM pg_catalog.pg_database WHERE datname = $1',
  values: [name],
})

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
    mergeMapTo(dbExists(opts, name)),
    tap(x => console.log(x ? 'Database Exists' : 'Creating new database...')),
    mergeMap(exists => exists
      ? empty()
      : createDatabase(opts, name).pipe(
        tap(() => console.log('Database created. Running initialisation scripts...')),
        mergeMapTo(initFromScript(config, sqlScriptPath)),
        tap(() => console.log('All done!')),
      )),
  )
}
