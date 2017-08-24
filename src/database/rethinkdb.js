import rethinkdb from 'rethinkdb'

export let connection = null

rethinkdb.connect({ host: 'localhost', port: 28015, db: 'publift' }).then(conn => {
  rethinkdb.tableList()
    .contains('session')
    .do(exists => rethinkdb.branch(exists, {tables_created: 0}, rethinkdb.tableCreate('session')))
    .run(conn)
  connection = conn
}).error(error => {
  throw error
})

export default rethinkdb
