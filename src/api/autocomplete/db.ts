import { OperatorFunction, pipe, forkJoin, of } from 'rxjs'
import { SqlOptions, SqlScalar, SqlQuery, fromSqlQuery, fromSqlCount } from '../db/opearators'
import { AutocompleteRequest, AutocompleteResponse, AutocompleteItem } from './types'
import { mergeMap, map, toArray } from 'rxjs/operators'
import { toPage } from '../types'

const toCountQuery = (
  pattern: string,
  { entity, field }: AutocompleteRequest,
): SqlScalar<string> => ({
  name: `autocomplete ${entity}.${field} count`,
  values: [pattern],
  text: `
SELECT COUNT(value)
FROM (
  SELECT DISTINCT "${field}" AS value
  FROM "${entity}"
  WHERE "${field}" LIKE $1
) q`,
})

const toDataQuery = (
  pattern: string,
  { limit, offset, entity, field }: AutocompleteRequest,
): SqlQuery<AutocompleteItem> => ({
  name: `autocomplete ${entity}.${field} 1`,
  values: [offset, limit, pattern],
  text: `
SELECT DISTINCT "${field}" AS value
FROM "${entity}"
WHERE "${field}" LIKE $3
ORDER BY "${field}"
OFFSET $1 ROWS
FETCH FIRST $2 ROW ONLY`
})


export const queryAutocomplete = (config: SqlOptions): OperatorFunction<AutocompleteRequest, AutocompleteResponse> => pipe(
  mergeMap((req) => {
    let reg = /^\w+$/
    if (!reg.test(req.entity) || !reg.test(req.field)) {
      throw new Error('Invalid `entity` or `field` parameters. Expected single-word table and column names.')
    }

    let pattern = req.value ? `%${req.value}%` : '%'

    let total = fromSqlCount(config, toCountQuery(pattern, req))
    let items = fromSqlQuery(config, toDataQuery(pattern, req)).pipe(toArray())

    return forkJoin({ total, items }).pipe(
      map(toPage<AutocompleteItem>(req)),
    )
  }),
)
