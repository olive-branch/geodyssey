import { GetOrdersRequest, GetOrdersResponse } from './types'
import { toPage, OrderAggregate } from '../../types'
import { sleep } from '../../util'
import { DATA } from '../../db/data'

const byYear = (year: number) => (x: OrderAggregate) => {
  let date = x.arrivedToApproverAt

  return date && date.getFullYear() === year
}

const toSearchFields = (x: OrderAggregate) => [
  x.bill,
  x.client,
  x.comments,
  x.number,
  x.pastCertificateSign,
  x.service,
  x.instrument.model,
  x.instrument.registry,
  x.instrument.serial,
  x.instrument.type,
  x.certificate?.comments,
  x.certificate?.issuer,
  x.certificate?.number,
  x.certificate?.sign,
]

export const byQuery = (query: string) => {
  query = query.toLowerCase()

  return (x: OrderAggregate) => toSearchFields(x)
    .filter(x => x !== undefined && x !== null)
    .some(x => x!.toLowerCase().includes(query))
}

export * from './types'

export const getOrders = async (request: GetOrdersRequest): Promise<GetOrdersResponse> => {
  await sleep(500)

  let query = request.query
  let data = query ? DATA.filter(byQuery(query)) : DATA
  let yearIdx = request.year ? DATA.findIndex(byYear(request.year)) : -1

  let offset = request.offset || 0
  let limit = request.limit || 20
  let start = yearIdx < 0 || yearIdx < offset ? offset : yearIdx
  let end = start + limit
  let items = data.slice(start, end)

  let total = data.length

  return toPage<OrderAggregate>({ limit, offset: start })({ items, total })
}
