import { etlx, defaultCommands, defaultConfiguration, observe } from '@etlx/cli'
import { polyfill } from '@etlx/cli/polyfills'
import { fromServer } from '@etlx/operators/http'

import { from } from 'rxjs'
import { mapTo, mergeMap } from 'rxjs/operators'

import { createServer } from '@marblejs/core'
import { httpListener } from '@marblejs/core'
import { logger$ } from '@marblejs/middleware-logger'
import { bodyParser$, urlEncodedParser, jsonParser } from '@marblejs/middleware-body'
import { r } from '@marblejs/core'

type AppConfig = any

const createHttpListener = (_: AppConfig) => httpListener({
    effects: [
        r.pipe(
            r.matchPath('/api'),
            r.matchType('GET'),
            r.useEffect($ => $.pipe(
                mapTo({ body: 'Hello, World!'}),
            )),
        ),
    ],
    middlewares: [
        logger$({ silent: false, filter: () => true }),
        bodyParser$({
            parser: urlEncodedParser,
            type: ['*/x-www-form-urlencoded'],
        }),
        bodyParser$({
            parser: jsonParser,
            type: ['*/json', 'application/vnd.api+json'],
        }),
    ],
})

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