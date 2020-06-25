import { AddOrderRequest, AddOrderResponse } from './types'
import { requestApi } from '../../../utils/client'

export const addOrder = async (request: AddOrderRequest) => requestApi<AddOrderResponse>({
  path: 'api/order',
  method: 'POST',
  body: request,
})
