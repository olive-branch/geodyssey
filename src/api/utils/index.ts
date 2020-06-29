export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

export const then = <T>(combine: (a: T, b: T) => T) => async (a: Promise<T>, b: () => Promise<T>) => {
  let prev = await a
  let next = await b()

  return combine(prev, next)
}

export type Obj = { [k: string]: any }

export const unfold = <T extends Obj = any>() => (plain: Obj): T => {
  let nested: any = {}

  Object.entries(plain).forEach(([k, v]) => {
      let parent = nested
      let keys = k.split('.')

      keys.forEach((key, i) => parent = parent[key] =
          i === keys.length - 1
              ? v
              : parent[key] || {},
      )
  })

  return nested
}

export const fold = (nested: Obj): Obj => Object.entries(nested).reduce(
  (acc, [k, v]) => {
    if (v instanceof Date || typeof v !== 'object' || Array.isArray(v)) {
      acc[k] = v
      return acc
    }

    Object.entries(fold(v)).forEach(([k1, v1]) => {
        acc[`${k}.${k1}`] = v1
    })

    return acc
  },
  {} as any,
)

export const filterProps = <T extends Obj = any>(f: (v: any, k: string) => boolean) =>
  (obj: T): Partial<T> => Object
    .entries(obj)
    .filter(([k, v]) => f(v, k))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
