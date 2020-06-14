export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

export const then = <T>(combine: (a: T, b: T) => T) => async (a: Promise<T>, b: () => Promise<T>) => {
  let prev = await a
  let next = await b()

  return combine(prev, next)
}

export const unfold = (plain: any) => {
  let nested: any = {}

  Object.entries(plain).forEach(([k, v]) => {
    let parent = nested
    let keys = k.split('.')

    keys.forEach((key, i) => {
      let val = i === keys.length - 1 ? v : {}
      parent[key] = val
      parent = parent[key]
    })
  })

  return nested
}
