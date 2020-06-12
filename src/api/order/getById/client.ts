import { OrderAggregate } from '../../types'
import { DATA } from '../../db/testData'
import { sleep } from '../../util'

export const getOrderById = async (id: string): Promise<OrderAggregate | null> => {
  await sleep(500)

  return DATA.find(x => x.id === id)
}
