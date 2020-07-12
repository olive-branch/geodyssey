import * as t from 'io-ts'
import { assertCompatible, _, optional } from './util'
import { Certificate } from './certificate'
import { Instrument } from './instrument'
import { Order } from './order'
import { OrderAggregate as ManualType } from '../../types'

type OrderAggregate = t.TypeOf<typeof OrderAggregate>
const OrderAggregate = t.intersection([
  Order,
  t.type({
    instrument: Instrument,
    certificate: optional(Certificate),
  })
])

assertCompatible<OrderAggregate>(_<ManualType>())
assertCompatible<ManualType>(_<OrderAggregate>())
