import { AppConfig } from '../../server/config'
import { r, HttpRequest } from '@marblejs/core'
import { map, mapTo } from 'rxjs/operators'
import { deleteOrderHandler } from './db'
import { DeleteOrderRequest } from './types'

type RouteParams = {
  id: string,
}

export const deleteOrderRoute = (config: AppConfig) => r.pipe(
  r.matchPath('/:id'),
  r.matchType('DELETE'),
  r.useEffect($ => $.pipe(
    map((req: HttpRequest<void, RouteParams, void>) => <DeleteOrderRequest>{ id: req.params.id }),
    deleteOrderHandler(config),
    mapTo({ }),
  ))
)
