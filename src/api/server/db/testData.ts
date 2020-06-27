import { Order, Model, Instrument, Certificate, OrderStatus, OrderAggregate } from "../../types"
import $ from 'casual'
import { v4 as uuid } from 'uuid'
import { addDays } from '../../../utils/date'


const services = [
  'Поверка',
  'Калибровка по длине',
  'Другое'
]

const instrumentTypes = [
  'Тахеометр электронный',
]

const clients = [
  'ФБУ Самарский ЦСМ',
  'ФБУ Архангельский ЦСМ',
  'ФБУ Московский ЦСМ',
  'ФБУ Петербуржский ЦСМ',
  'ФБУ Тульский ЦСМ',
  'ФБУ Ярославский ЦСМ',
]

const model = (i: number): Model => ({
  id: uuid(),
  createdAt: new Date('2020-05-04T10:00:00Z'),
  updatedAt: new Date('2020-05-04T10:00:00Z'),
})

const randomDate = (year?: number, month?: number, day?: number) => new Date(Date.UTC(
  $.integer(year || 2018, 2020),
  $.integer(month || 0, 13),
  $.integer(day || 1, 29),
))

export const createOrder = (i: number, rest?: Partial<Order>, hasCert?: boolean): Order => {
  let arrivedAt = randomDate()
  let arrivedToApproverAt = addDays(arrivedAt, 2)
  let deadlineAt = addDays(arrivedToApproverAt, 28)
  let departedAt = $.coin_flip && (hasCert || hasCert === undefined) ? addDays(deadlineAt, $.integer(-5, 5)) : undefined
  let status: OrderStatus = departedAt ? 'done' : hasCert ? 'ready' : 'notReady'

  return ({
    ...model(i),
    arrivedAt,
    arrivedToApproverAt,
    deadlineAt,
    departedAt,
    status,
    client: $.random_element(clients),
    comments: $.text,
    number: i.toString(10).padStart(4, '0'),
    bill: `МК ${$.integer(1000, 2000)} от ${$.date("DD-MM-YYYY")}`,
    service: $.random_element(services),
    instrumentId: '0',
    ...rest,
  })
}

export const createInstrument = (i: number, rest?: Partial<Instrument>): Instrument => ({
  ...model(i),
  type: $.random_element(instrumentTypes),
  model: `${$.company_name} ${$.year}`,
  serial: $.integer(100000, 999999).toString(10),
  registry: `${$.integer(10000, 99999)}-${$.integer(10, 99)}`,
  ...rest,
})

export const createCertificate = (i: number, rest?: Partial<Certificate>): Certificate => ({
  ...model(i),
  date: randomDate(),
  issuer: $.full_name,
  number: $.phone,
  sign: $.title,
  comments: $.text,
  instrumentId: '0',
  ...rest,
})

const range = (n: number) => Array(n).fill(undefined).map((_, i) => i)

export type AppData = {
  orders: Order[],
  instruments: Instrument[],
  certificates: Certificate[],
}
const generateState = (): AppData => range(1000).reduce(
  (acc, seed) => {
    let certNum = $.integer(0, 5)
    let hasCert = certNum > 0 && $.coin_flip.valueOf()

    let instrument = createInstrument(seed)
    let instrumentId = instrument.id

    let order = createOrder(seed, { instrumentId }, hasCert)

    let date = order.arrivedToApproverAt || randomDate(2020)
    let certificates = range(certNum).map((x, i) => {
      let days = hasCert ? x : x + 1

      return createCertificate(seed + i, {
        instrumentId,
        date: addDays(date, -365 * days),
      })
    })

    return {
      ...acc,
      orders: [...acc.orders, order],
      instruments: [...acc.instruments, instrument],
      certificates: [...acc.certificates, ...certificates.reverse()]
    } as AppData
  },
  { orders: [], instruments: [], certificates: [] } as AppData,
)



const stateToAggregate = (state: AppData): OrderAggregate[] => {
  let instruments = new Map(state.instruments.map(x => [x.id, x]))

  return state.orders.map((order) => {
    let iid = order.instrumentId

    let instrument = instruments.get(iid)!
    let certificates = state.certificates.filter(x => x.instrumentId === instrument.id).sort((a, b) => a > b ? 1 : -1)

    let [currentCert] = certificates
    let hasCurrentCert = currentCert && currentCert.date >= order.arrivedToApproverAt! && currentCert.date <= order.departedAt!

    let hasPastCert = hasCurrentCert ? certificates.length > 1 : certificates.length > 0
    let pastCert = hasPastCert ? hasCurrentCert ? certificates[1] : currentCert : undefined

    return <OrderAggregate>{
      ...order,
      instrument,
      certificate: hasCurrentCert ? currentCert : undefined,
      pastCertificateSign: pastCert?.sign,
    }
  })
}

export const DB = generateState()

export const generateAggregates = () => stateToAggregate(DB)
