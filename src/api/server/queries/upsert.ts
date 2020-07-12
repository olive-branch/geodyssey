import { Obj } from '../../utils'
import { SqlCommand } from '../db/opearators'

const pairwise = <A, B>(as: A[], bs: B[]): [A, B][] => as.map((a, i) => [a, bs[i]])

const isScalar = (x: any) =>
  x instanceof Date ||
  typeof x === 'boolean' ||
  typeof x === 'number' ||
  typeof x === 'string' ||
  x === null


type State = { fields: string[], variables: string[], values: any[] }

const initState: State = { fields: [], variables: [], values: [] }

const fieldsReducer = (n: number, keys?: string[]) => (acc: State, [k, v]: [string, any], i: number): State => {
  if (keys && !keys?.includes(k)) {
    return acc
  }

  let key = k.toLowerCase()

  return {
    fields: [...acc.fields, `"${key}"`],
    variables: [...acc.variables,  `$${i + n}`],
    values: [...acc.values, v],
  }
}

export const toUpdateStatement = (entity: string, x: Obj | undefined, keys?: string[]): SqlCommand | null => {
  if (x === undefined) {
    return null
  }

  let { fields, variables, values } = Object
    .entries(x)
    .filter(([_, v]) => isScalar(v))
    .reduce(fieldsReducer(2, keys), initState)

  if (fields.length === 0) {
    return null
  }


  let pairs = pairwise(fields, variables).map(([k, v]) => `${k} = ${v}`).join(', ')

  return {
    values: [x.id, ...values],
    text: `UPDATE "${entity}" SET ${pairs} WHERE id = $1`,
  }
}

export const toInsertStatement = (entity: string, x: Obj | undefined, keys?: string[]): SqlCommand | null => {
  if (x === undefined) {
    return null
  }

  let { fields, variables, values } = Object
    .entries(x)
    .filter(([, v]) => isScalar(v))
    .reduce(fieldsReducer(1, keys), initState)

  if (fields.length === 0) {
    return null
  }

  return {
    values: values,
    text: `INSERT INTO "${entity}" (${fields.join(', ')}) VALUES (${variables.join(', ')})`,
  }
}
