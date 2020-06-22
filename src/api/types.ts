const keys = <T>(x: T): Array<keyof T> => Object.keys(x) as Array<keyof T>

export type Model = {
  id: string,
  createdAt: Date,
  updatedAt: Date,
}
export const createModel = (value?: Partial<Model>): Model => ({
  id: '00000000-0000-0000-0000-00000000',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...value,
})

export type Instrument = Model & {
  type: string,
  model: string,
  serial: string,
  registry: string | undefined,
}
export const createInstrument = (value?: Partial<Instrument>): Instrument => ({
  ...createModel(),
  type: '',
  model: '',
  serial: '',
  registry: undefined,
  ...value,
})
export const instrumentFields = keys(createInstrument())

export type Certificate = Model & {
  instrumentId: string,
  number: string,
  sign: string,
  issuer: string,
  date: Date,
  comments: string,
}
export const createCertificate = (value?: Partial<Certificate>): Certificate => ({
  ...createModel(),
  instrumentId: '',
  number: '',
  sign: '',
  issuer: '',
  date: new Date(),
  comments: '',
  ...value,
})
export const certificateFields = keys(createCertificate())

export type OrderStatus =
  | 'notReady'
  | 'ready'
  | 'done'

export type Order = Model & {
  instrumentId: string,
  client: string,
  bill: string,
  number: string,
  service: string,
  comments: string,
  status: OrderStatus,
  arrivedToApproverAt: Date,
  arrivedAt: Date | undefined,
  deadlineAt: Date | undefined,
  departedAt: Date | undefined,
}
export const createOrder = (value?: Partial<Order>): Order => ({
  ...createModel(),
  instrumentId: '',
  client: '',
  bill: '',
  number: '',
  service: '',
  comments: '',
  status: 'notReady',
  arrivedToApproverAt: new Date(),
  arrivedAt: undefined,
  deadlineAt: undefined,
  departedAt: undefined,
  ...value,
})
export const orderFields = keys(createOrder())


export type OrderAggregate = Order & {
  instrument: Instrument,
  certificate: Certificate | undefined,
  pastCertificateSign: string | undefined,
}

export type PaginatedRequest = {
  limit: number,
  offset: number
}

export type PaginatedResponse<T> = {
  items: T[],
  total: number,
  limit: number,
  offset: number,
}

export const toPage = <T>(request: PaginatedRequest) => (x: { total: number, items: T[] }): PaginatedResponse<T> => {
  return {
    ...x,
    limit: request.limit,
    offset: request.offset,
  }
}
