import { GetOrdersRequest, GetOrderResponse, GetOrdersEntity } from './types'
import { toPage, sleep } from '../../util'
import { Model } from '../../types'

const model = (i: number): Model => ({
  id: `${i}`,
  createdAt: new Date('2020-05-04T10:00:00Z'),
  updatedAt: new Date('2020-05-04T10:00:00Z'),
  deletedAt: undefined,
})

const generateItem = (i: number): GetOrdersEntity => ({
  ...model(i),
  client: 'ФБУ "Самарский ЦСМ"',
  comments: 'с протоколом',
  number: '1408',
  bill: 'МК 1954 от 05.03.2020',
  service: 'Поверка',
  arrivedAt: new Date('2020-06-01T10:00:00Z'),
  arrivedToApproverAt: new Date('2020-06-02T10:00:00Z'),
  deadlineAt: new Date('2020-07-1T10:00:00'),
  departedAt: undefined,
  instrumentId: `${i}`,
  instrument: {
    ...model(i),
    name: 'Тахеометр электронный',
    mod: 'Leica TS60',
    serial: '886669',
    registry: '15689-18',
  },
})

const generateData = (request: GetOrdersRequest): GetOrderResponse => {
  let page = toPage(request)

  let start = request.offset || 0
  let end = start + (request.limit || 50)

  let count = 500
  let data = Array(count)
    .fill(undefined)
    .map((_, i) => i)
    .map(generateItem)
    .slice(start, end)

  return page({ total: count, items: data })
}

export const getOrders = async (request: GetOrdersRequest): Promise<GetOrderResponse> => {
  await sleep(500)

  return generateData(request)
}
