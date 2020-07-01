import { pipe } from 'rxjs'
import { OrderStatus } from '../types'
import { addDays } from '../utils/date'
import { Certificate } from './models/certificate'

type Base = {
  arrivedToApproverAt?: Date,
  arrivedAt?: Date,
  departedAt?: Date,
  deadlineAt?: Date,
  certificate?: any,
}

type WithStatus = { status: OrderStatus }

const toOrderStatus = <T extends Base>(x: T): OrderStatus => {
  if (x.departedAt) {
    return 'done'
  }
  if (x.certificate && x.arrivedAt) {
    return 'ready'
  }
  return 'notReady'
}

const inferStatus = <T extends Base>(x: T): T & WithStatus => ({
  ...x,
  status: toOrderStatus(x),
})

const inferDeadline = <T extends Base>(x: T): T =>
  x.deadlineAt || !x.arrivedToApproverAt ? x : {
    ...x,
    deadlineAt: addDays(x.arrivedToApproverAt, 28),
  }

export const applyBusinessRules = pipe(
  inferDeadline,
  inferStatus,
)
