import { GetOrdersRequest, GetOrderResponse } from './types'
import { toPage } from '../../types'
import { sleep } from '../../util'
import { DATA } from '../../db/testData'

export * from './types'

export const getOrders = async (request: GetOrdersRequest): Promise<GetOrderResponse> => {
  await sleep(500)

  let start = request.offset || 0
  let end = start + (request.limit || 50)

  let total = DATA.length
  let items = DATA.slice(start, end)

  return toPage(request)({ items, total })
}
