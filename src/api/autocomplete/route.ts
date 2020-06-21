import { r, HttpRequest } from '@marblejs/core'
import { map } from 'rxjs/operators'

import { AppConfig } from '../server/config'
import { queryAutocomplete } from './db'
import { AutocompleteRequest } from './types'

type RouteParams = {
  entity: string,
  field: string,
}

type QueryParams = {
  limit?: string,
  offset?: string,
  value?: string,
}

export const autocompleteRoute = (config: AppConfig) => r.pipe(
  r.matchPath('/:entity/autocomplete/:field'),
  r.matchType('GET'),
  r.useEffect($ => $.pipe(
    map((req: HttpRequest<void, RouteParams, QueryParams>) => {
      let limit = parseInt(req.query.limit!, 10) || 20
      let offset = parseInt(req.query.offset!, 10) || 0
      let { entity, field } = req.params
      let value = req.query.value

      return <AutocompleteRequest>{ limit, offset, entity, field, value }
    }),
    queryAutocomplete(config),
    map(body => ({ body })),
  )),
)
