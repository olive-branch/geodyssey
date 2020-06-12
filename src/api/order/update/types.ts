import { OrderAggregate, PartialOrderAggregate } from '../../types'

export type UpdateOrderRequest = { id: string } & PartialOrderAggregate

export type UpdateOrderResponse = OrderAggregate
