import { GetOrdersRequest, GetOrdersResponse } from './types'
import { OrderAggregate } from '../../types'
import { sleep } from '../../../utils'
import { DATA } from '../../server/db/data'
import { toPage } from '../../../utils/paging'

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
    .some(x => x!.toString().toLowerCase().includes(query))
}

export * from './types'

export const getOrders = async (request: GetOrdersRequest): Promise<GetOrdersResponse> => {
  await sleep(500)

  let query = request.query
  let data = query ? DATA.filter(byQuery(query)) : DATA

  let offset = request.offset
  let limit = request.limit
  let start = request.year ? DATA.findIndex(byYear(request.year)) : offset
  let end = start + limit
  let items = data.slice(start, end)

  let total = data.length

  return toPage<OrderAggregate>({ limit, offset: start })({ items, total })
}
