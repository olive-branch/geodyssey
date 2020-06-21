import { UpdateOrderRequest, UpdateOrderResponse } from './types'
import { sleep } from '../../../utils'

import { OrderAggregate } from '../../types'
import { DATA } from '../../server/db/data'

export * from './types'

export const updateOrder = async (req: UpdateOrderRequest): Promise<UpdateOrderResponse> => {
  await sleep(500)

  let id = req.id
  let idx = DATA.findIndex(x => x.id === id)

  let prevItem = DATA[idx]

  let nextItem: OrderAggregate = ({
    ...prevItem,
    ...req,
    instrument: {
      ...prevItem.instrument,
      ...req.instrument,
    },
    certificate: req.certificate || prevItem.certificate
      ? {
        ...prevItem.certificate!,
        ...req.certificate,
      }
      : undefined
  })

  DATA[idx] = nextItem

  return nextItem
}
