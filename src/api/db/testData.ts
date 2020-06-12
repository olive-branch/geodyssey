import { Order, Model, Instrument, Certificate } from "../types"

const model = (i: number): Model => ({
  id: `${i}`,
  createdAt: new Date('2020-05-04T10:00:00Z'),
  updatedAt: new Date('2020-05-04T10:00:00Z'),
  deletedAt: undefined,
})

export const createOrder = (i: number): Order => ({
  ...model(i),
  client: 'ФБУ "Самарский ЦСМ"',
  comments: 'с протоколом',
  number: '1408',
  bill: 'МК 1954 от 05.03.2020',
  service: 'Поверка',
  arrivedAt: new Date('2020-06-01T10:00:00Z'),
  arrivedToApproverAt: new Date('2020-06-02T10:00:00Z'),
  deadlineAt: new Date('2020-07-1T10:00:00'),
  status: 'ready',
  departedAt: undefined,
  instrumentId: `${i}`,
})

export const createInstrument = (i: number): Instrument => ({
  ...model(i),
  name: 'Тахеометр электронный',
  mod: 'Leica TS60',
  serial: '886669',
  registry: '15689-18',
})

export const createCertificate = (i: number, instrumentId: string): Certificate => ({
  instrumentId,
  ...model(i),
  date: new Date('2020-06-01T10:00:00Z'),
  issuer: 'Иванов Иван Иванович',
  number: '8/832-111-20',
  sign: 'Клеймо ФГУП "ВНИИФТРИ"',
  comments: '',
})
