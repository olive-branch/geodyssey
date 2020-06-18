import { PaginatedRequest, PaginatedResponse, OrderAggregate } from "../../types"

export type SearchOrdersRequest = PaginatedRequest & {
  query: string,
}

export type SearchOrdersResponse = PaginatedResponse<OrderAggregate>
