import * as t from 'io-ts'
import { date, assertCompatible, optional, _ } from './util'
import { Order as ManualType } from '../../types'

export type OrderStatus = t.TypeOf<typeof OrderStatus>
export const OrderStatus = t.keyof({
  notReady: null,
  ready: null,
  done: null,
})

export type Order = t.TypeOf<typeof Order>
export const Order = t.type(
  {
    id: t.string,
    createdAt: date,
    updatedAt: date,
    instrumentId: t.string,
    client: t.string,
    bill: t.string,
    number: t.string,
    service: t.string,
    comments: t.string,
    status: OrderStatus,
    arrivedToApproverAt: date,
    arrivedAt: optional(date),
    deadlineAt: optional(date),
    departedAt: optional(date),
  },
  'order',
)

export const name = Order.name
export const fields = Object.keys(Order.props)


// Compatibility checks
assertCompatible<Order>(_<ManualType>())
assertCompatible<ManualType>(_<Order>())
