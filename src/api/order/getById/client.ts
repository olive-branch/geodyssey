import { GetOrderByIdRequest, GetOrderByIdResponse } from './types'
import { requestApi } from '../../../utils/client'

export const getOrderById = async (request: GetOrderByIdRequest) => requestApi<GetOrderByIdResponse>({
  path: `api/order/${request.id}`,
})
