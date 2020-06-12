import { etlx, defaultCommands, defaultConfiguration, observe } from '@etlx/cli'
import { polyfill } from '@etlx/cli/polyfills'
import { fromServer } from '@etlx/operators/http'
import { from } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { createServer } from '@marblejs/core'

import { AppConfig } from './config'
import { createHttpListener } from './bootstrap'


const toServer = async (config: AppConfig) => {
  let server = await createServer({
    port: config.port || 8080,
    hostname: '',
    listener: createHttpListener(config),
  })

  return await server()
}

const run = (config: AppConfig) => from(toServer(config)).pipe(
  mergeMap(fromServer),
)

polyfill(global)

etlx(
  defaultCommands(),
  defaultConfiguration(),
  observe(run),
)()
