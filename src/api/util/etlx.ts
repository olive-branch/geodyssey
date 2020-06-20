import { Pool } from 'pg'
import { from } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { CreateServerConfig, createServer } from '@marblejs/core'
import { ConfigurationOptions } from '@etlx/cli/configuration'
import { fromServer } from '@etlx/operators/http'

export const override = <T>(f: (config: T) => T) => (opts: ConfigurationOptions): ConfigurationOptions => ({
  ...opts,
  overrides: [...opts.overrides, f],
})

export const addPgSql = () => override<any>(({ db }) => {
  let conn = new Pool(db)
  let pool = () => conn
  return { pool }
})

export const fromMarble = (config: CreateServerConfig) => from(createServer(config)).pipe(
  mergeMap(io => from(io())),
  mergeMap(fromServer),
)
