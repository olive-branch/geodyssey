import { map } from 'rxjs/operators'
import { r, HttpStatus, use } from '@marblejs/core'
import { t, requestValidator$ } from '@marblejs/middleware-io'

import { AppConfig } from '../../server/config'
import { Order } from '../../server/models/order'
import { Instrument } from '../../server/models/instrument'
import { optional, mergeTypes } from '../../server/models/util'
import { addOrderHandler } from './db'
import { AddOrderRequest } from './types'
import { Certificate } from '../../server/models/certificate'
import { applyBusinessRules } from '../../server/businessRules'


const withoutModel = t.type({
  id: t.void,
  createdAt: t.void,
  updatedAt: t.void,
  instrumentId: t.void,
})

const withoutStatus = t.type({
  status: t.any,
})

const body = t.exact(t.intersection([
  mergeTypes(Order, mergeTypes(withoutModel, withoutStatus)),
  t.type({
    instrument: mergeTypes(Instrument, withoutModel),
    certificate: optional(mergeTypes(Certificate, withoutModel)),
  }),
]))

export const addOrderRoute = (config: AppConfig) => r.pipe(
  r.matchPath('/'),
  r.matchType('POST'),
  r.useEffect($ => $.pipe(
    use(requestValidator$({ body })),
    map((req) => req.body as unknown as AddOrderRequest),
    map(applyBusinessRules),
    addOrderHandler(config),
    map(body => ({ body, status: HttpStatus.CREATED })),
  ))
)
