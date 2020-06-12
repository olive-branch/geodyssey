import { randomInt } from 'fp-ts/lib/Random'
import { UpdateOrderRequest, UpdateOrderResponse } from './types'
import { sleep } from '../../util'
import { Instrument } from '../../types'

import { createCertificate, createInstrument, createOrder } from '../../db/testData'

export const updateOrder = async (req: UpdateOrderRequest): Promise<UpdateOrderResponse> => {
  await sleep(500)

  let seed = randomInt(500, 1000)()

  let instrument: Instrument = {
    ...createInstrument(seed),
    ...req.instrument,
  }

  return ({
    ...createOrder(seed),
    ...req,
    instrument,
    certificate: req.certificate ? undefined : {
      ...createCertificate(seed, instrument.id),
      ...req.certificate,
    }
  })
}