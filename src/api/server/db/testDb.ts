import { from } from 'rxjs'
import { SqlOptions } from './opearators'

export const testDb = (config: SqlOptions) => {
  let p = config
    .pool()
    .connect()
    .then(x => x.release())
    .catch(() => Promise.reject('Unable to connect to the database. Check your database configuration and if the database is running.'))

  return from(p)
}
