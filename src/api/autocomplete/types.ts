import { PaginatedRequest, PaginatedResponse } from "../types"

export type AutocompleteRequest = PaginatedRequest & {
  entity: string,
  field: string,
  value?: string,
}

export type AutocompleteItem = { id?: string, value: string }

export type AutocompleteResponse = PaginatedResponse<AutocompleteItem>
