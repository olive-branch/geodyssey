import { autocomplete } from '@/api/autocomplete';

const AutocompleteService = {
  getInitValues(): Promise<{types: Array<string>, issuers: Array<string>}> {
    return Promise.all([this.getTypes(), this.getIssuers()])
      .then(([types, issuers]) => ({ types, issuers }))
      .catch(x => {
        console.error(x)
        return {types: [], issuers: [] }
      })
  },
  getTypes(inputValue: string = ''): Promise<Array<string>> {
    return autocomplete({limit: 100, offset: 0, entity: 'instrument', field: 'type', value: inputValue})
      .then(x => x.items.map(item => item.value))
      .catch(x => {
        console.log(x);
        return []
      })
  },
  getIssuers(inputValue: string = ''): Promise<Array<string>> {
    return autocomplete({limit: 100, offset: 0, entity: 'certificate', field: 'issuer', value: inputValue})
      .then(x => x.items.map(item => item.value))
      .catch(x => {
        console.log(x);
        return []
      })
  }
}
export default AutocompleteService;