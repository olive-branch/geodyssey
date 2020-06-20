import { r, HttpRequest } from '@marblejs/core'
import { map } from 'rxjs/operators'

import { AppConfig } from '../../config'
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
      map(body => ({ body }))
  )),
)
