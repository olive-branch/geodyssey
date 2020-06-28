import { resolve } from 'path'
import { etlx, defaultCommands, defaultConfiguration, observe } from '@etlx/cli'
import { polyfill } from '@etlx/cli/polyfills'

import { AppConfig, appSchema } from './config'
import { createHttpListener } from './bootstrap'
import { seed } from './db/seed'
import { configure } from '@etlx/cli/configuration'
import { fromMarble, addPgSql } from './etlx'
import { initDb } from './db/createDb'


const SQL_SCRIPT = resolve(__dirname, '..', '..', '..', 'sql', 'init.sql')

const server = (config: AppConfig) => fromMarble({
  port: config.port || 8080,
  hostname: '',
  listener: createHttpListener(config),
})

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
