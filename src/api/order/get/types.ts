import { PaginatedRequest, PaginatedResponse, OrderAggregate } from '../../types'

export type GetOrdersRequest = PaginatedRequest

export type GetOrdersResponse = PaginatedResponse<OrderAggregate>
