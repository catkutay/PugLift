import rethinkdb from 'rethinkdb'
import { response } from '../server/routes'

export let connection = null

const HOST = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? '10.152.0.2' : 'localhost'

const tables = [
  'page_load',
  'bid_request',
  'bid_response',
  'ad_request',
  'ad_response',
  'ad_view',
]

const createDatabase = conn => {
  rethinkdb.dbList()
    .contains('publift')
    .do(exists => rethinkdb.branch(exists, {databases_created: 0}, rethinkdb.dbCreate('publift')))
    .run(conn).then(createTables(conn))
}

const createTables = conn => {
  conn.use('publift')

  // get list of existing tables and if the tables names above do not already exist, create them
  rethinkdb.tableList()
    .run(conn)
    .then(list => {
      tables.forEach(table => {
        rethinkdb.branch(list.includes(table), {tables_created: 0}, rethinkdb.tableCreate(table))
          .run(conn)
      })
    })
  connection = conn
}

rethinkdb.connect({ host: HOST, port: 28015 })
  .then(createDatabase)
  .catch(error => {
    throw error
  })

export function handleEvent (data, callback) {
  // convert timestamps to date objects
  data.timestamp = rethinkdb.epochTime(data.timestamp)
  rethinkdb.table(data.event_label)
    .insert(data)
    .run(connection)
    .then(result => {
      callback(response[data.type])
    })
    .catch(err => {
      throw err
    })
}

export default rethinkdb
