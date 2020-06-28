import { r, HttpStatus, use } from '@marblejs/core'
import { t, requestValidator$ } from '@marblejs/middleware-io'
import { map, mapTo } from 'rxjs/operators'

import { AppConfig } from '../../server/config'
import { Order } from '../../server/models/order'
import { Instrument } from '../../server/models/instrument'
import { optional, mergeTypes } from '../../server/models/util'
import { updateOrderHandler } from './db'
import { UpdateOrderRequest } from './types'
import { applyBusinessRules } from '../../server/businessRules'
import { Certificate } from '../../server/models/certificate'

const withId = t.type({ id: t.string }, 'id')
const withoutModel = t.type({
  id: t.void,
  createdAt: t.void,
  updatedAt: t.void,
  instrumentId: t.any,
})

const body = t.exact(t.intersection([
  t.partial(Order.props),
  t.type({
    instrument: optional(t.intersection([
      withId,
      t.partial(Instrument.props),
    ])),
    certificate: optional(t.union([
      mergeTypes(Certificate, withoutModel),
      t.intersection([t.partial(Certificate.props), withId]),
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
    map(applyBusinessRules),
    updateOrderHandler(config),
    mapTo({ status: HttpStatus.ACCEPTED }),
  ))
)
