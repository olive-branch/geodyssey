import { Order, Instrument, Certificate } from '../../types'

type Id = { id: string }

export type UpdateOrderRequest =
  & Id & Partial<Order>
  & {
    instrument?: Id & Partial<Instrument>,
    certificate?: Id & Partial<Certificate>,
  }

export type UpdateOrderResponse = void
