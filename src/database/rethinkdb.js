import rethinkdb from 'rethinkdb'

const promise = rethinkdb.connect({ host: 'localhost', port: 28015, db: 'publift' })

export const connection = promise.then(conn => {
  console.log(rethinkdb.tableList().contains('users').do(exists => rethinkdb.branch(exists, {tables_created: 0}, rethinkdb.tableCreate('users'))))
  rethinkdb.tableList()
    .contains('users')
    .do(exists => rethinkdb.branch(exists, {tables_created: 0}, rethinkdb.tableCreate('users')))
    .run()
  return conn
}).error(error => {
  throw error
})

export default rethinkdb
