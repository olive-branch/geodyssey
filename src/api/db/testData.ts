import { Order, Model, Instrument, Certificate, OrderStatus } from "../types"
import $ from 'casual'


const clients = [
  'ФБУ Самарский ЦСМ',
  'ФБУ Архангельский ЦСМ',
  'ФБУ Московский ЦСМ',
  'ФБУ Петербуржский ЦСМ',
  'ФБУ Тульский ЦСМ',
  'ФБУ Ярославский ЦСМ',
  'ФБУ Самарский ЦСМ',
]

const services = [
  'Поверка',
  'Калибровка по длине',
  'Другое'
]

const instrumentTypes = [
  'Тахеометр электронный',
]

const model = (i: number): Model => ({
  id: `${i}`,
  createdAt: new Date('2020-05-04T10:00:00Z'),
  updatedAt: new Date('2020-05-04T10:00:00Z'),
  deletedAt: undefined,
})

const addDays = (x: Date, days: number) => {
  let date = new Date(x.valueOf());
  date.setDate(date.getDate() + days);

  return date;
}

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
    number: $.integer(1000, 5000).toString(10),
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
