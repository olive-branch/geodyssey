import { OrderAggregate, Instrument, Certificate } from '../../types'

type NoModel = {
  id: never,
  createdAt: never,
  updatedAt: never,
}
export type AddOrderRequest = OrderAggregate & NoModel & {
  instrument: Instrument & NoModel,
  certificate?: Certificate & NoModel,
}

export type AddOrderResponse = OrderAggregate
