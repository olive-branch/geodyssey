import { QueryConfig, Pool } from 'pg'
import { from, Observable } from 'rxjs'
import { mergeMap, map } from 'rxjs/operators'
import { unfold, filterProps } from '../util'

export type SqlCommand = QueryConfig

export type SqlQuery<T = any> = QueryConfig

export type SqlScalar<T = any> = QueryConfig

export type SqlOptions = {
  pool: () => Pool,
}

export const fromSqlQuery = <T>({ pool }: SqlOptions, query: SqlQuery<T>): Observable<T> =>
  from(pool().query<T>(query)).pipe(
    mergeMap(x => x.rows),
    map(filterProps<T>(x => x !== null)),
    map(unfold<T>()),
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


export const columns = (entity: string, fields: string[], prefix?: string) => fields
  .map(col => prefix
      ? `"${entity}".${col} AS "${prefix}.${col}"`
      : `"${entity}".${col} AS "${col}"`)
  .join(', ')
