// import { connection } from '../../database/mongodb'
import { MongoClient } from 'mongodb'

const HOST = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? '10.152.0.12' : 'localhost'
const url = `mongodb://${HOST}:27017/publift`
const mongo = new MongoClient()
let conn = null

mongo.connect(url, (err, db) => {
  if (err) { throw err }
  conn = db
})

export function getTotal (table, filters, callback) {
  /*
  var filter = {}
  for (var i = 0, len = filters.length; i < len; i++) {
    filter[filters[i].type] = filters[i].value
  }
  */
  const collection = conn.collection(table)
  collection.find(filters).count(function (err, result) {
    if (err) throw err
    result = result === null ? 'No results found' : result + ' result(s) found'
    callback(result)
  })
}

export function getList (table, filters, callback) {
  /*
  var filter = {}
  for (var i = 0, len = filters.length; i < len; i++) {
    filter[filters[i].type] = filters[i].value
  }
  */
  const collection = conn.collection(table)
  collection.find(filters).toArray(function (err, result) {
    if (err) throw err
    result = result === null ? 'No results found' : JSON.stringify(result)
    callback(result)
  })
}
