import { OrderAggregate, Instrument, Certificate } from '../../types'

type NoModel = {
  id: never,
  createdAt: never,
  updatedAt: never,
}

type NoInstrumentId = {
  instrumentId: never,
}

export type AddOrderRequest =
  & OrderAggregate
  & NoModel
  & NoInstrumentId
  & {
    instrument: Instrument & NoModel,
    certificate?: Certificate & NoModel & NoInstrumentId,
  }

export type AddOrderResponse = OrderAggregate
