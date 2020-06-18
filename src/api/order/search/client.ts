import { SearchOrdersRequest, SearchOrdersResponse } from './types'
import { toPage, OrderAggregate } from '../../types'
import { sleep } from '../../util'
import { DATA } from '../../db/testData'

export * from './types'

const byQuery = (query: string) => (x: OrderAggregate) => {
  let fields = [
    x.bill,
    x.client,
    x.comments,
    x.number,
    x.service,
    x.instrument.model,
    x.instrument.type,
    x.instrument.serial,
    x.instrument.registry,
    x.certificate?.comments,
    x.certificate?.issuer,
    x.certificate?.number,
    x.certificate?.sign,
  ]

  query = query.toLowerCase()

  return fields
    .filter(x => x !== undefined)
    .map(x => x!.toString().toLowerCase())
    .some(x => query.includes(x))
}

export const searchOrders = async (request: SearchOrdersRequest): Promise<SearchOrdersResponse> => {
  await sleep(500)

  let start = request.offset || 0
  let end = start + (request.limit || 50)

  let total = DATA.length
  let items = DATA
    .filter(byQuery(request.query))
    .slice(start, end)

  return toPage(request)({ items, total })
}

