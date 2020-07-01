import { GetOrdersRequest, GetOrdersResponse } from './types'
import { requestApi } from '../../utils/client'

export const getOrders = async (request: GetOrdersRequest) => requestApi<GetOrdersResponse>({
  path: 'api/order',
  query: request,
})
