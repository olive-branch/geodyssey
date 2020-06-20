import { sleep } from '../../util'
import { GetOrderByIdResponse, GetOrderByIdRequest } from './types'
import { DATA } from '../../db/data'

export const getOrderById = async (request: GetOrderByIdRequest): Promise<GetOrderByIdResponse> => {
  await sleep(500)

  return DATA.find(x => x.id === request.id) || null
}