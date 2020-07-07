import { r, HttpStatus, use, HttpEffectResponse, HttpRequest } from '@marblejs/core'
import { t, requestValidator$ } from '@marblejs/middleware-io'
import { pipe } from 'rxjs'
import { map, mapTo } from 'rxjs/operators'

import { AppConfig } from '../../server/config'
import { Order } from '../../server/models/order'
import { Instrument } from '../../server/models/instrument'
import { mergeTypes } from '../../server/models/util'
import { updateOrderHandler } from './db'
import { UpdateOrderRequest } from './types'
import { applyBusinessRules } from '../../server/businessRules'
import { Certificate } from '../../server/models/certificate'
import { queryOrderById } from '../getById/db'
import { split, condition } from '@etlx/operators/core'
import { OrderAggregate } from '../../types'
import { orderFields } from '../../server/models/meta'


const withId = t.type({ id: t.string }, 'id')

const body = pipe(
  t.partial,
  t.exact,
)({
  ...Order.props,
  instrument: t.partial(mergeTypes(
    Instrument,
    withId,
  ).props),
  certificate: t.partial(Certificate.props),
})

const orderExists = ([, order]: [UpdateOrderRequest, OrderAggregate | null]) => !!order

const normalizeRequest = ([patch, agg]: [UpdateOrderRequest, OrderAggregate]): UpdateOrderRequest => {
  let instrument = { ...agg.instrument, ...patch.instrument  }

  let certificate = agg.certificate || patch.certificate
    ? { ...agg.certificate, ...patch.certificate }
    : undefined

  let order = orderFields.reduce((acc, key) => ({ ...acc, [key]: (agg as any)[key] }), {})

  return {
    ...order,
    ...patch,
    instrument,
    certificate,
  }
}

const update = (config: AppConfig) => pipe(
  map(normalizeRequest),
  map(applyBusinessRules),
  updateOrderHandler(config),
  mapTo<any, HttpEffectResponse>({ status: HttpStatus.ACCEPTED })
)

const orderNotFound = () => pipe(
  mapTo<any, HttpEffectResponse>({
    status: HttpStatus.BAD_REQUEST,
    body: {
      error: {
        status: HttpStatus.BAD_REQUEST,
        message: 'Order with specified id not found.'
      }
    },
  })
)

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
    split($ => $, queryOrderById(config)),
    condition(orderExists, update(config), orderNotFound()),
  ))
)
