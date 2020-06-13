import { Pool } from 'pg'

export type AppConfig = {
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
