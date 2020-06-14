import { OrderAggregate } from '../../types'
import { DATA } from '../../db/testData'
import { sleep } from '../../util'

export const getOrderById = async (id: string): Promise<OrderAggregate | undefined> => {
  await sleep(500)

  return DATA.find(x => x.id === id)
}
