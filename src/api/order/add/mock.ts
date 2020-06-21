import { AddOrderRequest, AddOrderResponse } from './types'
import { sleep } from '../../../utils'

export * from './types'

export const addOrder = async (req: AddOrderRequest): Promise<AddOrderResponse> => {
  await sleep(500)

  return req as any
}
