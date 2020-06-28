import { etlx, defaultCommands, defaultConfiguration, observe } from '@etlx/cli'
import { polyfill } from '@etlx/cli/polyfills'

import { AppConfig } from './config'
import { createHttpListener } from './bootstrap'
import { seed } from './db/seed'
import { configure, addObject } from '@etlx/cli/configuration'
import { fromMarble, addPgSql } from './etlx'


const server = (config: AppConfig) => fromMarble({
  port: config.port || 8080,
  hostname: '',
  listener: createHttpListener(config),
})

polyfill(global)

etlx(
  defaultCommands(),
  defaultConfiguration(),
  configure(
    addObject({
      db: {
        host: '192.168.0.12',
        user: 'postgres',
        password: 'postgres',
        database: 'geodyssey',
        port: 5432,
      }
    }),
    addPgSql(),
  ),
  observe(seed(), 'seed'),
  observe(server, 'server'),
)()
