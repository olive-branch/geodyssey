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


export type Model = {
  id: string,
  createdAt: Date,
  updatedAt: Date,
}


export type Instrument = Model & {
  type: string,
  model: string,
  serial: string,
  registry: string | undefined,
}


export type Certificate = Model & {
  instrumentId: string,
  number: string,
  sign: string,
  issuer: string,
  date: Date,
  comments: string,
}


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


export type OrderAggregate = Order & {
  instrument: Instrument,
  certificate: Certificate | undefined,
  pastCertificateSign: string | undefined,
}
