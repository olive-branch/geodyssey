import { pipe } from 'rxjs'
import { OrderStatus } from '../types'
import { addDays } from '../utils/date'

type Base = {
  arrivedToApproverAt?: Date | null,
  arrivedAt?: Date | null,
  departedAt?: Date | null,
  deadlineAt?: Date | null,
  certificate?: { date?: Date | null },
}

type WithStatus = { status: OrderStatus }

const toOrderStatus = <T extends Base>(x: T): OrderStatus => {
  if (x.departedAt) {
    return 'done'
  }
  if (x.certificate && x.certificate.date && x.arrivedAt) {
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
