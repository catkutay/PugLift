import { MongoClient } from 'mongodb'
import { url } from '../../database/mongodb'

// Variables for establishing a connection from the API to the MongoDB
const mongo = new MongoClient()
let conn = null

// Establishes a new connection to the database for the API calls
mongo.connect(url, (err, db) => {
  if (err) { throw err }
  conn = db
})

/**
 * getTotal - Queries the database for the total count of results based on the
 * query provided by the user
 *
 * @param  {String} table    Name of the table, i.e. the event type
 * @param  {Array} filters  Array of objects of all filters as [type] = value
 * @param  {function(result, err)} callback Returns the result and/or error
 * @return {type}          Result or Error through a callback
 */
export function getTotal (table, filters, callback) {
  const collection = conn.collection(table)
  collection.find(filters).count(function (err, result) {
    if (err) throw err
    result = result === null ? 'No results found' : result + ' result(s) found'
    callback(result) // Call back to API Event method with result
  })
}

/**
 * getList - Queries the database for a list of results in JSON format, based on
 * the query provided by the user
 *
 * @param  {String} table    Name of the table, i.e. the event type
 * @param  {Array} filters  Array of objects of all filters as [type] = value
 * @param  {function(result, err)} callback Returns the result and/or error
 * @return {type}          Result or Error through a callback
 */
export function getList (table, filters, callback) {
  const collection = conn.collection(table)
  collection.find(filters).toArray(function (err, result) {
    if (err) throw err
    result = result === null ? 'No results found' : JSON.stringify(result) // Objects need to be read back as string
    callback(result) // Call back to the API Event method with result
  })
}
