import { response } from '../server/routes'
import { MongoClient } from 'mongodb'
import { logger, profileLogger, enableProfilling } from '../winstonconfig'

const HOST = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? '10.152.0.12' : 'localhost'
const url = `mongodb://${HOST}:27017/publift`
const mongo = new MongoClient()
let conn = null

mongo.connect(url, (err, db) => {
  if (err) { logger.err(err) }
  conn = db
})

export function handleEvent (data, uniqueProfilingID, callback) {
  const collection = conn.collection(data.type)
  collection.insertOne(data.value)
  callback(response[data.type], ` ${data.value.user_id}`)
  if (enableProfilling) {
    profileLogger.profile(uniqueProfilingID, `${uniqueProfilingID}: ` + data.type)
  }
}
