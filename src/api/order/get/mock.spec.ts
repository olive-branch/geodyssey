import { getOrders, byQuery } from "./mock"
import { DATA } from "../../server/db/data"
import { GetOrdersRequest } from "./types"
import { toPage } from "../../utils/paging"

describe('get orders mock', () => {
  it('single entry', async () => {
    let req = <GetOrdersRequest>{ limit: 1, offset: 0 }

    let actual = await getOrders(req)

    let expected = toPage(req)({ items: DATA.slice(0, 1), total: DATA.length })

    expect(actual).toEqual(expected)
  })

  it('pagination', async () => {
    let req = <GetOrdersRequest>{ limit: 10, offset: 10 }

    let actual = await getOrders(req)

    let expected = toPage(req)({ items: DATA.slice(10, 20), total: DATA.length })

    expect(actual).toEqual(expected)
  })

  it('year pagination', async () => {
    let req = <GetOrdersRequest>{ limit: 10, offset: 10, year: 2019 }

    let actual = await getOrders(req)

    let idx = DATA.findIndex(x => x.arrivedToApproverAt!.getFullYear() === req.year)
    let expected = toPage({ limit: req.limit, offset: idx })({
      total: DATA.length,
      items: DATA.slice(idx, idx + req.limit),
    })

    expect(actual).toEqual(expected)
  })

  it('search', async () => {
    let req = <GetOrdersRequest>{ limit: 10, offset: 0, query: 'lorem' }

    let actual = await getOrders(req)

    let data = DATA.filter(byQuery('lorem'))
    let expected = toPage(req)({
      items: data.slice(0, 10),
      total: data.length
    })

    expect(actual).toEqual(expected)
  })
})
