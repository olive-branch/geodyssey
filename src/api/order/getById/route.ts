import { r, HttpRequest, HttpStatus, HttpEffectResponse } from '@marblejs/core'
import { map, tap } from 'rxjs/operators'

import { AppConfig } from '../../server/config'
import { queryOrderById } from './db'
import { GetOrderByIdRequest } from './types'

type Params = {
  id: string,
}

export const getOrderByIdRoute = (config: AppConfig) => r.pipe(
  r.matchPath('/:id'),
  r.matchType('GET'),
  r.useEffect($ => $.pipe(
      map((req: HttpRequest<void, Params, void>) => {
        let id = req.params.id

        return <GetOrderByIdRequest>{ id }
      }),
      queryOrderById(config),
      map(body => <HttpEffectResponse>({
        body: body || undefined,
        status: body ? HttpStatus.OK : HttpStatus.NO_CONTENT,
      }))
  )),
)
