import { QueryConfig, Pool, QueryResult } from 'pg'
import { from, Observable } from 'rxjs'
import { mergeMap, map } from 'rxjs/operators'
import { unfold } from '../util'

type Obj = { [key: string]: any }

export type SqlCommand = QueryConfig

export type SqlQuery<T extends Obj = any> = QueryConfig & {
}

export type SqlScalar<T = any> = QueryConfig

export type SqlOptions = {
  pool: () => Pool,
}

export const fromSqlQuery = <T extends Obj>({ pool }: SqlOptions, query: SqlQuery<T>): Observable<T> =>
  from(pool().query<T>(query)).pipe(
    mergeMap(x => x.rows),
    map(unfold),
  )

export const queryScalar = async <T = any>(pool: Pool, q: QueryConfig): Promise<T> => {
  let data = await pool.query(q)

  if (data.rowCount !== 1) {
    throw new Error(`Scalar queries must always return single row, but ${data.rowCount} received`)
  }
  if (data.fields.length !== 1) {
    throw new Error(`Scalar queries must always return single column, but ${data.fields.length} received`)
  }

  let [row] = data.rows
  let [{ name }] = data.fields

  return row[name]
}

export const fromSqlScalar = <T>({ pool }: SqlOptions, query: SqlScalar<T>): Observable<T> =>
  from(queryScalar<T>(pool(), query))

export const fromSqlCommand = ({ pool }: SqlOptions, query: SqlCommand): Observable<number> =>
  from(pool().query(query)).pipe(
    map(x => x.rowCount),
  )
