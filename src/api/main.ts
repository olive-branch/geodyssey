import { resolve } from 'path'
import { mergeMap, defaultIfEmpty } from 'rxjs/operators'
import { etlx, defaultCommands, defaultConfiguration, observe } from '@etlx/cli'
import { polyfill } from '@etlx/cli/polyfills'
import { configure } from '@etlx/cli/configuration'

import { fromMarble, addPgSql } from './server/etlx'
import { AppConfig, appSchema } from './server/config'
import { createHttpListener } from './server/bootstrap'
import { initDb } from './server/db/createDb'
import { seed } from './server/db/seed'


const SQL_SCRIPT = resolve(__dirname, '../..', 'sql', 'init.sql')

const server = (config: AppConfig) => initDb(SQL_SCRIPT, config).pipe(
  defaultIfEmpty(),
  mergeMap(() => fromMarble({
    port: config.port || 8080,
    hostname: '',
    listener: createHttpListener(config),
  })),
)

polyfill(global)

etlx(
  defaultCommands(),
  defaultConfiguration(appSchema),
  configure(
    addPgSql(),
  ),
  observe(server, 'server'),
  // observe(seed()),
)()
