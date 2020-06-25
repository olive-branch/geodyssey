import { DeleteOrderRequest, DeleteOrderResponse } from './types'
import { sleep } from '../../../utils'

export const deleteOrder = async (req: DeleteOrderRequest): Promise<DeleteOrderResponse> => {
  await sleep(500)
}
