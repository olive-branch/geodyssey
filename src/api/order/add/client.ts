import { randomInt } from 'fp-ts/lib/Random'
import { AddOrderRequest, AddOrderResponse } from './types'
import { sleep } from '../../util'
import { Instrument } from '../../types'

import { createCertificate, createInstrument, createOrder, DATA } from '../../db/testData'

export * from './types'

export const addOrder = async (req: AddOrderRequest): Promise<AddOrderResponse> => {
  await sleep(500)

  let seed = randomInt(500, 1000)()

  let instrument: Instrument = {
    ...createInstrument(seed),
    ...req.instrument,
  }

  let item = ({
    ...createOrder(seed),
    ...req,
    instrument,
    certificate: req.certificate ? undefined : {
      ...createCertificate(seed, { instrumentId: instrument.id }),
      ...req.certificate,
    }
  })

  DATA.push(item)

  return item
}
