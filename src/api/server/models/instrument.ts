import * as t from 'io-ts'
import { date, assertCompatible, optional, _ } from './util'
import { Instrument as ManualType } from '../../types'

export type Instrument = t.TypeOf<typeof Instrument>
export const Instrument = t.type(
  {
    id: t.string,
    createdAt: date,
    updatedAt: date,
    type: t.string,
    model: t.string,
    serial: t.string,
    registry: optional(t.string),
  },
  'instrument',
)

export const name = Instrument.name
export const fields = Object.keys(Instrument.props)


// Compatibility checks
assertCompatible<Instrument>(_<ManualType>())
assertCompatible<ManualType>(_<Instrument>())
