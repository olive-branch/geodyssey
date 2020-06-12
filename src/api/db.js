const pg = require('pg')

async function main() {
  let pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'geodyssey',
    password: 'postgres',
    port: 5432,
  })

  let { rows, fields } = await pool.query('SELECT COUNT(*) as total FROM requests')

  let [first] = rows
  let [{ name }] = fields

  console.log(first[name])
}

main()
.catch(console.error)
