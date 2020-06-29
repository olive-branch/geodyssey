import { AutocompleteRequest, AutocompleteResponse } from './types'
import { requestApi } from '../utils/client'

export const autocomplete = async (request: AutocompleteRequest) => requestApi<AutocompleteResponse>({
  path: `api/${request.entity}/autocomplete/${request.field}`,
  query: {
    value: request.value,
    limit: request.limit,
    offset: request.offset,
  }
})
