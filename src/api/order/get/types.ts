import { PaginatedRequest, PaginatedResponse, OrderAggregate } from '../../types'

export type GetOrdersRequest = PaginatedRequest & {
  year?: number,
}

export type GetOrdersResponse = PaginatedResponse<OrderAggregate>
