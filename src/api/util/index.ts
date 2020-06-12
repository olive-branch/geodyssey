import { PaginatedRequest, PaginatedResponse } from '../types'

export const toPage = (request: PaginatedRequest) => <T>(x: { total: number, items: T[] }): PaginatedResponse<T> => {
  return {
    ...x,
    limit: request.limit || 50,
    offset: request.offset || 0,
  }
}

export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))
