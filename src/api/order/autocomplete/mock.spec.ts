import { autocomplete } from "./mock"
import { AutocompleteResponse, AutocompleteItem } from "./types"
import { CLIENTS } from "../../db/data"

describe('autocomplete', () => {
  it('complete orders field', async () => {
    let init = { field: 'client', value: 'ФБУ', limit: 10, offset: 0 }

    let expected: AutocompleteResponse = {
      items: CLIENTS
        .map(value => <AutocompleteItem>{ value })
        .sort((a, b) => a.value > b.value ? 1 : -1),
      limit: init.limit,
      offset: init.offset,
      total: CLIENTS.length,
    }

    let actual = await autocomplete(init)

    expect(actual).toEqual(expected)
  })

  it('complete instrument field', async () => {
    let init = { field: 'instrument.model', value: 'strosin', limit: 10, offset: 0 }

    let expected: AutocompleteResponse = {
      items: [
        { value: 'Strosin Group 1995' },
        { value: 'Strosin LLC 1973' },
        { value: 'Strosin PLC 2015' }
      ],
      limit: init.limit,
      offset: init.offset,
      total: 3,
    }

    let actual = await autocomplete(init)

    expect(actual).toEqual(expected)
  })
})
