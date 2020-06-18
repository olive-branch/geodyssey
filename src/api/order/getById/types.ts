import { OrderAggregate } from "../../types"

export type GetOrderByIdRequest = {
  id: string
}

export type GetOrderByIdResponse = OrderAggregate | null
