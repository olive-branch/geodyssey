import { PaginatedRequest, Order, Instrument, PaginatedResponse } from '../../types'

export type GetOrdersRequest = PaginatedRequest & {
  sort?: string[],
  filter?: Partial<GetOrdersEntity>,
}

export type GetOrdersEntity = Order & {
  instrument: Instrument,
}

export type GetOrderResponse = PaginatedResponse<GetOrdersEntity>
