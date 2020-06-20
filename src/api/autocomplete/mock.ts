
import { AutocompleteRequest, AutocompleteResponse, AutocompleteItem } from './types'
import { DATA } from '../db/data'
import { sleep, fold } from '../util'
import { toPage } from '../types'

export const autocomplete = async (req: AutocompleteRequest): Promise<AutocompleteResponse> => {
  await sleep(100)

  let page = toPage<AutocompleteItem>(req)
  let { value, field, limit, offset } = req

  let match = (x: any) =>
    ! value ||
    typeof x === 'string' &&
    x.toLowerCase().startsWith(value.toLowerCase())

  let values = DATA
    .map(fold)
    .map(x => x[field])
    .filter(match)

  let data = Array
    .from(new Set(values).keys())
    .sort((a, b) => a > b ? 1 : -1)
    .map(value => <AutocompleteItem>{ value })

  let items = data.slice(offset, limit + offset)

  return page({ items, total: data.length })
}
