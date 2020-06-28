import { OperatorFunction, pipe, forkJoin, of, empty, merge, Observable } from 'rxjs'
import { SqlOptions, SqlScalar, SqlQuery, fromSqlQuery, fromSqlCount } from '../server/db/opearators'
import { AutocompleteRequest, AutocompleteResponse, AutocompleteItem } from './types'
import { mergeMap, map, toArray, filter, distinct } from 'rxjs/operators'
import { toPage } from '../../utils/paging'

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

const matchPattern = (pattern: string | undefined) => (x: string) => !pattern || x.includes(pattern)
const toAutocompleteItem = (value: string): AutocompleteItem => ({ value })

const staticInstrumentType = (req: AutocompleteRequest): Observable<AutocompleteItem> =>
  req.entity === 'instrument' && req.field === 'type'
    ? of(
      'Тахеометр электронный',
      'Теодолит',
      'Машина координатно-измерительная мобильная',
      'Лазерный сканер',
      'Аппаратура спутниковая геодезическая',
      'Платформа гироскопическая',
      'Нивелир электронный',
      'Система координатно-измерительная',
    ).pipe(
      filter(matchPattern(req.value)),
      map(toAutocompleteItem),
    )
    : empty()

const staticCertificateIssuer = (req: AutocompleteRequest): Observable<AutocompleteItem> =>
  req.entity === 'certificate' && req.field === 'issuer'
    ? of(
      'Черепенников И.В.',
      'Дейкун А.В.',
      'Воронов А.В.',
      'Комаров С.Ю.',
      'Ханзадян М.А.',
      'Мазуркевич А.В.',
      'Верницкий Д.М.',
      'Лесниченко В.И.',
      'Чикинев С.В.'
      ).pipe(
        filter(matchPattern(req.value)),
        map(toAutocompleteItem),
      )
    : empty()

export const queryAutocomplete = (config: SqlOptions): OperatorFunction<AutocompleteRequest, AutocompleteResponse> => pipe(
  mergeMap((req) => {
    let reg = /^\w+$/
    if (!reg.test(req.entity) || !reg.test(req.field)) {
      throw new Error('Invalid `entity` or `field` parameters. Expected single-word table and column names.')
    }

    let pattern = req.value ? `%${req.value}%` : '%'

    let total = fromSqlCount(config, toCountQuery(pattern, req))
    let data = fromSqlQuery(config, toDataQuery(pattern, req))

    // TODO: Remove static data in future versions
    // let items = data.pipe(toArray())

    let items = merge(
      data,
      staticCertificateIssuer(req),
      staticInstrumentType(req),
    ).pipe(
      distinct(x => x.value),
      toArray(),
      map(x => x.sort((a, b) => a.value > b.value ? 1 : -1))
    )

    return forkJoin({ total, items }).pipe(
      map(toPage<AutocompleteItem>(req)),
    )
  }),
)
