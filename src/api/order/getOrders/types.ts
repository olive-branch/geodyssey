import { PaginatedRequest, PaginatedResponse, OrderAggregate, Order } from '../../types'

export type GetOrdersRequest = PaginatedRequest & {
  filter?: Partial<Order>,
}

export type GetOrderResponse = PaginatedResponse<OrderAggregate>
