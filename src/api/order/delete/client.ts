import { DeleteOrderRequest, DeleteOrderResponse } from './types'
import { requestApi } from '../../utils/client'

export const deleteOrder = async (request: DeleteOrderRequest) => requestApi<DeleteOrderResponse>({
  path: `api/order/${request.id}`,
  method: 'DELETE',
})
