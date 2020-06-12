import { PaginatedRequest, PaginatedResponse } from '../types'

export const toPage = (request: PaginatedRequest) => <T>(x: { count: number, data: T[] }): PaginatedResponse<T> => {
  return {
    limit: request.limit || 50,
    offset: request.offset || 0,
    total: x.count,
    items: x.data,
  }
}
