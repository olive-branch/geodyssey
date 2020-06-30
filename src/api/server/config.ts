import { Pool } from 'pg'
import { createSchema } from '@etlx/cli/configuration'
import { resolve } from 'path'

export const appSchema = createSchema<AppConfig>({
  staticDir: {
    doc: 'Static files directory path',
    format: String,
    default: 'static',
    arg: 'dir',
  },
  port: {
    doc: 'Application server port',
    format: Number,
    default: 8080,
    env: 'GEOPORT',
    arg: 'port',
  },
  db: {
    host: {
      doc: 'Database host address',
      format: String,
      default: 'localhost',
      env: 'PGHOST'
    },
    port: {
      doc: 'Database address port',
      format: Number,
      default: 5432,
      env: 'PGPORT'
    },
    database: {
      doc: 'Database name',
      format: String,
      default: 'geodyssey',
      env: 'PGDATABASE',
    },
    user: {
      doc: 'Database user',
      format: String,
      default: 'postgres',
      env: 'PGUSER',
    },
    password: {
      doc: 'Database password',
      format: String,
      default: 'postgres',
      sensitive: true,
      env: 'PGPASSWORD',
    }
  }
})

export type AppConfig = {
  staticDir: string,
  port?: number,
  db: {
    user: string,
    host: string,
    database: string,
    password: string,
    port: number,
  }
  pool: () => Pool,
}
