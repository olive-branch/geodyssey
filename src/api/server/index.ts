import { resolve } from 'path'
import { mergeMap } from 'rxjs/operators'
import { etlx, defaultCommands, defaultConfiguration, observe } from '@etlx/cli'
import { polyfill } from '@etlx/cli/polyfills'
import { configure } from '@etlx/cli/configuration'

import { fromMarble, addPgSql } from './etlx'
import { AppConfig, appSchema } from './config'
import { createHttpListener } from './bootstrap'
import { seed } from './db/seed'
import { initDb } from './db/createDb'
import { testDb } from './db/testDb'


const SQL_SCRIPT = resolve(__dirname, '..', '..', '..', 'sql', 'init.sql')

const server = (config: AppConfig) => testDb(config).pipe(
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
  observe(seed(), 'seed'),
  observe(server, 'server'),
  observe(initDb(SQL_SCRIPT), 'init'),
)()
