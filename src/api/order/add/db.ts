import { SqlOptions, fromSqlTransaction, fromSqlQuery, columns } from '../../server/db/opearators'
import { pipe, OperatorFunction, Observable } from 'rxjs'
import { AddOrderRequest, AddOrderResponse } from './types'
import { mergeMap, mapTo, map, defaultIfEmpty } from 'rxjs/operators'
import { OrderAggregate } from '../../types'

import { toInsertStatement, toUpdateStatement } from '../../server/queries/upsert'
import { model, instrumentFields, orderFields, certificateFields } from '../../server/models/meta'
import { Instrument } from '../../server/models/instrument'
import { Order } from '../../server/models/order'
import { Certificate } from '../../server/models/certificate'


const notNull = <T>(x: T | null): x is T => x !== null

const newInstrument = (req: AddOrderRequest): Instrument => ({ ...req.instrument, ...model() })

const createOrder = (req: AddOrderRequest, instrument: Instrument): Order => ({
  ...req,
  ...model(),
  instrumentId: instrument.id,
})

const createCertificate = (req: AddOrderRequest, instrument: Instrument): Certificate => ({
  ...req.certificate!,
  ...model(),
  instrumentId: instrument.id,
})

const createInstrument = (req: AddOrderRequest, instrument: Instrument): Instrument => ({
  ...req.instrument,
  ...instrument,
  registry: req.instrument.registry || instrument.registry,
  pastCertificateSign: req.instrument.pastCertificateSign || instrument.pastCertificateSign,
})

const toCommands = (req: AddOrderRequest) => (pastInstrument: Instrument | null) => {
  let instrument = createInstrument(req, pastInstrument ? pastInstrument : newInstrument(req))
  let order = createOrder(req, instrument)
  let certificate = req.certificate ? createCertificate(req, instrument) : undefined

  let aggregate: OrderAggregate = { ...order, instrument, certificate }

  let commands = [
    pastInstrument
      ? toUpdateStatement('instrument', instrument, instrumentFields)
      : toInsertStatement('instrument', instrument, instrumentFields),
    toInsertStatement('certificate', certificate, certificateFields),
    toInsertStatement('order', order, orderFields),
  ].filter(notNull)

  return { aggregate, commands }
}

const queryInstrument = (config: SqlOptions, req: AddOrderRequest): Observable<Instrument> => fromSqlQuery<Instrument>(config, {
  name: 'query instrument by type-model-serial',
  values: [req.instrument.type, req.instrument.model, req.instrument.serial],
  text: `
    SELECT
      ${columns('i', instrumentFields)},
      c.sign AS "pastCertificateSign"
    FROM instrument i
      LEFT JOIN certificate c ON c.instrumentId = i.id
    WHERE i.type = $1 AND i.model = $2 AND i.serial = $3
  `,
})

const normalizeRequest = (config: SqlOptions) => (req: AddOrderRequest) =>
  queryInstrument(config, req).pipe(
    defaultIfEmpty(null as Instrument | null),
    map(toCommands(req)),
  )

export const addOrderHandler = (config: SqlOptions): OperatorFunction<AddOrderRequest, AddOrderResponse> => pipe(
  mergeMap(normalizeRequest(config)),
  mergeMap(({ aggregate, commands}) =>
    fromSqlTransaction(config, commands).pipe(mapTo(aggregate)),
  ),
)
