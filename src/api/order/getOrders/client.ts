import { GetOrdersRequest, GetOrderResponse, GetOrdersEntity } from './types'
import { toPage, sleep } from '../../util'
import { createOrder, createInstrument } from '../../db/testData'

const createItem = (i: number): GetOrdersEntity => ({
  ...createOrder(i),
  instrument: createInstrument(i),
})

const testData = (request: GetOrdersRequest): GetOrderResponse => {
  let page = toPage(request)

  let start = request.offset || 0
  let end = start + (request.limit || 50)

  let count = 500
  let data = Array(count)
    .fill(undefined)
    .map((_, i) => i)
    .map(createItem)
    .slice(start, end)

  return page({ total: count, items: data })
}

export const getOrders = async (request: GetOrdersRequest): Promise<GetOrderResponse> => {
  await sleep(500)

  return testData(request)
}
