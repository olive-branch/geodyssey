import { SqlOptions, SqlCommand, fromSqlTransaction } from '../../server/db/opearators'
import { pipe, OperatorFunction } from 'rxjs'
import { UpdateOrderRequest, UpdateOrderResponse } from './types'
import { map, mergeMap, mapTo } from 'rxjs/operators'
import { toUpdateStatement, toInsertStatement } from '../../server/db/sql'
import { certificateName, orderName, instrumentName, model } from '../../server/models/meta'


const toCommands = (req: UpdateOrderRequest): SqlCommand[] => {
  let upsertCertificate = req.certificate && req.certificate.id
    ? toUpdateStatement(certificateName, req.certificate)
    : toInsertStatement(certificateName, { ...req.certificate, ...model() })

  let commands = [
    toUpdateStatement(instrumentName, req.instrument),
    upsertCertificate,
    toUpdateStatement(orderName, req),
  ]

  return commands.filter(x => x !== null) as SqlCommand[]
}

const normalizeRequest = (x: UpdateOrderRequest): UpdateOrderRequest => {
  let insertCert = x.certificate && !x.certificate.id
  let instrumentId = x.instrumentId || x.certificate?.instrumentId || x.instrument?.id

  if (insertCert && !instrumentId) {
    throw new Error('Unable to create certificate - instrumentId must be defined.')
  }

  let updatedAt = new Date()
  let createdAt: Date | undefined = undefined

  return {
    ...x,
    createdAt,
    updatedAt,
    instrument: x.instrument === undefined ? undefined : {
      ...x.instrument,
      createdAt,
      updatedAt,
    },
    certificate: x.certificate
      ? insertCert
        ? { ...x.certificate, instrumentId }
        : { ...x.certificate, createdAt, updatedAt }
      : undefined,
  }
}

export const updateOrderHandler = (config: SqlOptions): OperatorFunction<UpdateOrderRequest, UpdateOrderResponse> => pipe(
  map(normalizeRequest),
  map(toCommands),
  mergeMap(x => fromSqlTransaction(config, x)),
  mapTo(undefined),
)
