import { AppConfig } from '../../server/config'
import { r, HttpRequest, HttpStatus } from '@marblejs/core'
import { map, mapTo } from 'rxjs/operators'
import { updateOrderHandler } from './db'
import { UpdateOrderRequest } from './types'

type RouteParams = { id: string }

type Body = UpdateOrderRequest

export const updateOrderRoute = (config: AppConfig) => r.pipe(
  r.matchPath('/:id'),
  r.matchType('PATCH'),
  r.useEffect($ => $.pipe(
    map((req: HttpRequest<Body, RouteParams, void>) => {
      let id = req.params.id
      let rest = req.body

      // todo: validate body

      return <UpdateOrderRequest>{ ...rest, id }
    }),
    updateOrderHandler(config),
    mapTo({ status: HttpStatus.ACCEPTED }),
  ))
)
