import { Obj } from '../../utils'
import { SqlCommand } from './opearators'

const pairwise = <A, B>(as: A[], bs: B[]): [A, B][] => as.map((a, i) => [a, bs[i]])

const isScalar = (x: any) =>
  x instanceof Date ||
  typeof x === 'boolean' ||
  typeof x === 'number' ||
  typeof x === 'string' ||
  x === null


type State = { fields: string[], variables: string[], values: any[] }

const initState: State = { fields: [], variables: [], values: [] }

const fieldsReducer = (n: number) => (acc: State, [k, v]: [string, any], i: number): State => {
  let key = k.toLowerCase()

  return {
    fields: [...acc.fields, `"${key}"`],
    variables: [...acc.variables,  `$${i + n}`],
    values: [...acc.values, v],
  }
}

export const toUpdateStatement = (entity: string, x: Obj | undefined): SqlCommand | null => {
  if (x === undefined) {
    return null
  }

  let { fields, variables, values } = Object
    .entries(x)
    .filter(([_, v]) => isScalar(v))
    .reduce(fieldsReducer(2), initState)

  if (fields.length === 0) {
    return null
  }

  let pairs = pairwise(fields, variables).map(([k, v]) => `${k} = ${v}`).join(', ')

  return {
    values: [x.id, ...values],
    text: `UPDATE "${entity}" SET ${pairs} WHERE id = $1`,
  }
}

export const toInsertStatement = (entity: string, x: Obj | undefined): SqlCommand | null => {
  if (x === undefined) {
    return null
  }

  let { fields, variables, values } = Object
    .entries(x)
    .filter(([_, v]) => isScalar(v))
    .reduce(fieldsReducer(1), initState)

  if (fields.length === 0) {
    return null
  }

  return {
    values: values,
    text: `INSERT INTO "${entity}" (${fields.join(', ')}) VALUES (${variables.join(', ')})`,
  }
}
