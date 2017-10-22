import { response } from '../server/routes'
import { MongoClient } from 'mongodb'

const HOST = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? '10.152.0.12' : 'localhost'
const url = `mongodb://${HOST}:27017/publift`
const mongo = new MongoClient()
let conn = null

mongo.connect(url, (err, db) => {
  if (err) { console.log(err) }
  conn = db
})

export function handleEvent (data, callback) {
  const collection = conn.collection(data.type)
  if (Array.isArray(data.value)) {
    collection.insertMany(data.value) // allow for the insertion of arrays of JSON (specifically for ad_request)
  } else {
    collection.insertOne(data.value)
  }
  callback(response[data.type])
}
