import { r, HttpStatus, use } from '@marblejs/core'
import { t, requestValidator$ } from '@marblejs/middleware-io'
import { map, mapTo } from 'rxjs/operators'

import { AppConfig } from '../../server/config'
import { Order } from '../../server/models/order'
import { Instrument } from '../../server/models/instrument'
import { optional } from '../../server/models/util'
import { updateOrderHandler } from './db'
import { UpdateOrderRequest } from './types'

const withId = t.type({ id: t.string }, 'id')

const body = t.exact(t.intersection([
  t.partial(Order.props),
  t.type({
    instrument: optional(t.intersection([
      withId,
      t.partial(Instrument.props),
    ])),
    certificate: optional(t.intersection([
      withId,
      t.partial(Order.props),
    ])),
  }),
]))


export const updateOrderRoute = (config: AppConfig) => r.pipe(
  r.matchPath('/:id'),
  r.matchType('PATCH'),
  r.useEffect($ => $.pipe(
    use(requestValidator$({ body, params: withId })),
    map((req) => {
      let { id } = req.params
      let rest = req.body

      return <UpdateOrderRequest>{ ...rest, id }
    }),
    updateOrderHandler(config),
    mapTo({ status: HttpStatus.ACCEPTED }),
  ))
)
