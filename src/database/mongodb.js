import { response } from '../server/routes'
import { MongoClient } from 'mongodb'

const HOST = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? '10.152.0.11' : 'localhost'
const url = `mongodb://${HOST}:27017/publift`
const mongo = new MongoClient()
let conn = null

mongo.connect(url, (err, db) => {
  if (err) { console.log(err) }
  conn = db
})

export function handleEvent (data, callback) {
  const coll = conn.collection(data.type)
  coll.insertOne(data.value)
  callback(response[data.type])
}
