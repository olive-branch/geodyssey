import { parse as parseUrl } from 'url'
import { join, extname, posix } from 'path'
import { createReadStream } from 'fs'
import { OperatorFunction, pipe, Observable } from 'rxjs'
import { map, mergeMap, mapTo } from 'rxjs/operators'
import { getType } from 'mime'
import { r, HttpRequest, HttpEffectResponse, HttpHeaders } from '@marblejs/core'
import { exists } from '@etlx/operators/fs'
import { condition } from '@etlx/operators/core'

type FileInfo = {
  exists: boolean,
  path: string,
  mime?: string,
}

const toFilePath = (opts: StaticRouteOptions) => ({ url }: HttpRequest) => {
  let defaultFile = 'index.html'
  let pathname = parseUrl(url).pathname!
  let ext = extname(pathname)

  if (ext) {
    return join(opts.baseDir, pathname)
  }

  if (opts.historyApiFallback) {
    return join(opts.baseDir, defaultFile)
  }

  return join(opts.baseDir, pathname, defaultFile)
}

const toFileInfo = (path: string): Observable<FileInfo> => exists(path).pipe(
  map(exists => ({ path, exists, mime: getType(path) || undefined })),
)

const success = (opts: StaticRouteOptions): OperatorFunction<FileInfo, HttpEffectResponse> => pipe(
  map(({ mime, path }) => ({
    body: createReadStream(path),
    headers: {
      'Content-Type': mime,
      'Cache-Control': mime === 'text/html' ? 'no-cache' : 'max-age=31536000',
      ...opts.headers,
    }
  })),
)

const notFound = (): OperatorFunction<FileInfo, HttpEffectResponse> => pipe(
  mapTo({ status: 404 }),
)

const toRoutePath = (opts: StaticRouteOptions) => opts.path ? posix.join(opts.path, '*') : '*'


export type StaticRouteOptions = {
  baseDir: string,
  historyApiFallback?: boolean,
  headers?: HttpHeaders,
  path?: string,
}
export const staticRoute = (opts: StaticRouteOptions) => r.pipe(
  r.matchPath(toRoutePath(opts)),
  r.matchType('GET'),
  r.useEffect($ => $.pipe(
    map(toFilePath(opts)),
    mergeMap(toFileInfo),
    condition(x => x.exists, success(opts), notFound())
  )),
)
