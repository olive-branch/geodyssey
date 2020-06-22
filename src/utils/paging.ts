import { PaginatedRequest, PaginatedResponse } from '../api/types'

export const toPage = <T>(request: PaginatedRequest) => (x: { total: number, items: T[] }): PaginatedResponse<T> => {
  return {
    ...x,
    limit: request.limit,
    offset: request.offset,
  }
}
