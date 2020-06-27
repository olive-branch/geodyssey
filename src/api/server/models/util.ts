import * as t from 'io-ts'
import { Either } from 'fp-ts/lib/Either'

const isDate = (u: unknown): u is Date => u instanceof Date

const parseDate = (optional: boolean = false) => (x: unknown, ctx: t.Context): Either<t.Errors, Date> => {
  if (x instanceof Date) {
    return t.success(x)
  }
  if (typeof x === 'string') {
    let date = new Date(x)

    return isNaN(date.getTime())
      ? optional ? t.success(undefined as any) : t.failure(x, ctx)
      : t.success(date)
  }

  return t.failure(x, ctx)
}

export const date = new t.Type<Date, string>(
  'date',
  isDate,
  parseDate(),
  x => x.toISOString(),
)

export const optionalDate = new t.Type<Date | undefined, string>(
  'date',
  isDate,
  parseDate(true),
  x => x ? x.toISOString() : '',
)

export const optional = <T extends t.Any>(
  type: T,
  name = `${type.name} | undefined`
): t.UnionType<
  [T, t.UndefinedType],
  t.TypeOf<T> | undefined,
  t.OutputOf<T> | undefined,
  t.InputOf<T> | undefined
> =>
  t.union<[T, t.UndefinedType]>([type, t.undefined], name)

export const mergeTypes = <A extends t.Props, B extends t.Props>(
  a: t.TypeC<A>,
  b: t.TypeC<B>,
  name?: string,
): t.TypeC<A & B> =>
  t.type(Object.assign({}, a.props, b.props), name)


export const _ = <T>(): T => undefined as any as T
export const assertCompatible = <A>(x: A): A => x
