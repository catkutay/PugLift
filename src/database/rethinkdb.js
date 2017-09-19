import rethinkdb from 'rethinkdb'
import { response } from '../server/routes'

export let connection = null

const HOST = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? '10.152.0.2' : 'localhost'

const createDatabase = conn => {
  rethinkdb.dbList()
    .contains('publift')
    .do(exists => rethinkdb.branch(exists, {databases_created: 0}, rethinkdb.dbCreate('publift')))
    .run(conn).then(createTables(conn))
}

const createTables = conn => {
  conn.use('publift')
  rethinkdb.tableList()
    .contains('session')
    .do(exists => rethinkdb.branch(exists, {tables_created: 0}, rethinkdb.tableCreate('session')))
    .run(conn)
  connection = conn
}

rethinkdb.connect({ host: HOST, port: 28015 })
  .then(createDatabase)
  .catch(error => {
    throw error
  })

export function handleEvent (data, callback) {
  rethinkdb.table('session')
    .insert(data.value)
    .run(connection)
    .then(result => {
      callback(response[data.type])
    })
    .catch(err => {
      throw err
    })
}

export default rethinkdb
