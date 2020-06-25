import { UpdateOrderRequest, UpdateOrderResponse } from './types'
import { requestApi } from '../../../utils/client'

export const updateOrder = async (request: UpdateOrderRequest) => requestApi<UpdateOrderResponse>({
  path: `api/order/${request.id}`,
  method: 'PATCH',
  body: request,
})
