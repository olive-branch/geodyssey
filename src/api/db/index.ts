import { QueryConfig, Pool } from 'pg'
import { from, Observable } from 'rxjs'
import { mergeMap, map } from 'rxjs/operators'

type Obj = { [key: string]: any }


export type SqlQuery<T extends Obj = any> = QueryConfig

export type SqlScalar<T = any> = QueryConfig

export type SqlOptions = {
  sql: Pool
}

export const countQuery = (q: SqlQuery): SqlScalar<number> => {
  return {
    name: q.name ? `count ${q.name}` : undefined,
    values: q.values,
    text: `SELECT COUNT(*) as total FROM (${q.text}) AS q`,
  }
}



export const fromSqlQuery = <T extends Obj>({ sql }: SqlOptions, query: SqlQuery<T>): Observable<T> =>
  from(sql.query<T>(query)).pipe(
    mergeMap(x => x.rows),
  )


export const queryScalar = async <T = any>(sql: Pool, q: QueryConfig): Promise<T> => {
  let data = await sql.query(q)

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

export const fromSqlScalar = <T>({ sql }: SqlOptions, query: SqlScalar<T>): Observable<T> =>
  from(queryScalar<T>(sql, query))
