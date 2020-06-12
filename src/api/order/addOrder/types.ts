import { Order, Instrument, OrderAggregate, PartialOrderAggregate } from '../../types'

export type AddOrderRequest = PartialOrderAggregate

export type AddOrderResponse = OrderAggregate
