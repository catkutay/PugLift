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
  convertDate(data)
  const collection = conn.collection(data.type)
  if (Array.isArray(data.value)) {
    collection.insertMany(data.value) // allow for the insertion of arrays of JSON (specifically for ad_request)
  } else {
    collection.insertOne(data.value)
  }
  callback(response[data.type])
}

function convertDate (parsedObj) {
  // convert event timestamps to ISO strings recursively (given objects with multiple nesting levels) so that the result can be manipulated for the purposes of the query API
  // code reference: https://stackoverflow.com/questions/15523514/find-by-key-deep-in-a-nested-object
  let nestedObj = null
  if (parsedObj instanceof Array) {
    for (let i = 0; i < parsedObj.length; i++) {
      nestedObj = convertDate(parsedObj[i])
      if (nestedObj) {
        break
      }
    }
  } else {
    for (let prop in parsedObj) {
      // find timestamps by value format rather than key; assumes the format is YYYY-MM-DDT00:00:00.000Z
      if (/^[\d]{4}-[\d]{2}-[\d]{1,2}T[\d]{2}:[\d]{2}:[\d]{2}\.[\d]{3}Z$/.test(parsedObj[prop])) {
        parsedObj[prop] = new Date(parsedObj[prop]).toISOString()
      }
      if (parsedObj[prop] instanceof Object || parsedObj[prop] instanceof Array) {
        nestedObj = convertDate(parsedObj[prop])
        if (nestedObj) {
          break
        }
      }
    }
  }
  return nestedObj
}
