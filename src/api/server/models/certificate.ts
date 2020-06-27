import * as t from 'io-ts'
import { date, assertCompatible, _ } from './util'
import { Certificate as ManualType } from '../../types'

export type Certificate = t.TypeOf<typeof Certificate>
export const Certificate = t.type(
  {
    id: t.string,
    createdAt: date,
    updatedAt: date,
    instrumentId: t.string,
    number: t.string,
    sign: t.string,
    issuer: t.string,
    date: date,
    comments: t.string,
  },
  'certificate',
)

export const name = Certificate.name
export const fields = Object.keys(Certificate.props)


// Compatibility checks
assertCompatible<Certificate>(_<ManualType>())
assertCompatible<ManualType>(_<Certificate>())
