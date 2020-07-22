import { PaginatedRequest, PaginatedResponse, OrderAggregate } from '../../types'

export type GetOrdersRequest = PaginatedRequest & {
  year?: number,
  query?: string,
}

export type GetOrdersResponse = PaginatedResponse<OrderAggregate> & {
  years: number[],
}
