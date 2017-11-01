/*
import rethinkdb from '../../database/rethinkdb'

const HOST = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? '10.152.0.2' : 'localhost'

let connection = null
rethinkdb.connect({ host: HOST, port: 28015, db: 'publift' })
  .then(conn => connection = conn)
  .then(() => {
    const demo = new rethinkQueries()
    demo.countAllEvents((err, cursor) => console.log(cursor))
  })

class rethinkQueries {
  countAllEvents(callback) {
    rethinkdb
      .table('session')
      .count()
      .run(connection, callback)
  }

  eventsForTimePeriod(timeMin, timeMax) {
    return 'hoorah'
  }
}

const now = Date.now()
const lastMonth = new Date().setMonth(new Date().getMonth() - 1)

export default rethinkQueries
*/
