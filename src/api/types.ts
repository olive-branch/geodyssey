export type Model = {
  id: string,
  createdAt: Date,
  updatedAt: Date,
  deletedAt?: Date,
}

export type Instrument = Model & {
  name: string,
  mod: string,
  serial: string,
  registry: string,
}

export type Certificate = Model & {
  instrumentId: string,
  number: string,
  sign: string,
  issuer: string,
  date: Date,
}

export type Order = Model & {
  instrumentId: string,
  client: string,
  bill: string,
  number: string,
  service: string,
  comments: string,
  arrivedToApproverAt?: Date,
  arrivedAt?: Date,
  deadlineAt?: Date,
  departedAt?: Date,
}

export type PaginatedRequest = {
  limit?: number,
  offset?: number
}

export type PaginatedResponse<T> = {
  items: T[],
  total: number,
  limit: number,
  offset: number,
}
