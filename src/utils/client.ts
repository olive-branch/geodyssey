type Scalar = null | undefined | string | number | boolean
type QueryObject = { [key: string]: Scalar }

const formatQueryString = (obj: QueryObject) => {
  let pairs: [string, any][] = Object.entries(obj).filter(([, x]) => x !== undefined && x !== null)

  return new URLSearchParams(pairs).toString()
}

const formatUrl = (url: string, query?: QueryObject) => {
  return query ? `${url}?${formatQueryString(query)}` : url
}


type Parser = (k: string, v: any) => any

const dateParser: Parser = (k, v) => {
  let isDate = k === 'date' || k.endsWith('At')

  return v && isDate ? new Date(v) : v
}

const isJson = (resp: { headers: Headers }) => {
  let mime = resp.headers['content-type'] as string

  return mime && mime.startsWith('application/json')
}

const ensureSuccessStatusCode = (resp: { status: number, statusText: string }) => {
  if (resp.status >= 200 && resp.status < 300) {
    return
  } else {
    throw new Error(`Response status code (${resp.status} ${resp.statusText}) does not indicate success`)
  }
}

export type ApiRequest = {
  path: string,
  method?: string,
  query?: QueryObject,
  body?: any,
  headers?: Headers
}

export const requestApi = async <T>(request: ApiRequest): Promise<T> => {
  let resp = await fetch(formatUrl(request.path, request.query), {
    method: request.method,
    headers: {
      'content-type': 'application/json',
      ...request.headers,
    },
    body: request.body ? JSON.stringify(request.body) : undefined,
  })

  ensureSuccessStatusCode(resp)

  return isJson(resp)
    ? JSON.parse(await resp.text(), dateParser)
    : undefined
}
