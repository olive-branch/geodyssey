import { Model } from '../../types'
import { v4 as uuid } from 'uuid'

export { name as instrumentName, fields as instrumentFields } from './instrument'
export { name as certificateName, fields as certificateFields } from './certificate'
export { name as orderName, fields as orderFields } from './order'

export const model = (): Model => {
  let date = new Date()

  return {
    id: uuid(),
    createdAt: date,
    updatedAt: date,
  }
}
