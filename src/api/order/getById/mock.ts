import { sleep } from '../../../utils'
import { GetOrderByIdResponse, GetOrderByIdRequest } from './types'
import { DATA } from '../../server/db/data'

export const getOrderById = async (request: GetOrderByIdRequest): Promise<GetOrderByIdResponse> => {
  await sleep(500)

  return DATA.find(x => x.id === request.id) || null
}
