import { DeleteOrderRequest, DeleteOrderResponse } from './types'
import { sleep } from '../../util'

export * from './types'

export const deleteOrder = async (req: DeleteOrderRequest): Promise<DeleteOrderResponse> => {
  await sleep(500)
}
