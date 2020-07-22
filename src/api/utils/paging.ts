import { PaginatedRequest, PaginatedResponse } from '../types'

export const toPage = <A>(request: PaginatedRequest) => <B extends { total: number, items: A[] }>(x: B): B & PaginatedResponse<A> => {
  return {
    ...x,
    limit: request.limit,
    offset: request.offset,
  }
}
