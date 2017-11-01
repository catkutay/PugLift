import { getTotal, getList } from '../database/mongodbproxy'

/*
* The type of event to query i.e. The database table name
* e.g. event=page_load
*/
var eventMatches = [
  'page_load',
  'bid_request',
  'bid_response',
  'ad_request',
  'ad_response',
  'ad_view',
  'creative_render',
]

/**
* e.g. The type of query
* Total = Count results || List = Display all results in JSON
* e.g type=Total
*/
var typeMatches = [
  'total',
  'list',
]

/**
* Filter types for the query. A user can use multiple queries
* e.g &filter:user_id=xyz,date=17/01/2017
*/
var filterMatches = [
  'user_id',
  'event_type',
  'date',
  'date_range',
  'session',
]

// Regex for validating the date provided by the date filter (e.g. 17/01/2017)
const dateRegex = new RegExp('(^(((0[1-9]|1[0-9]|2[0-8])[/](0[1-9]|1[012]))|' +
'((29|30|31)[/](0[13578]|1[02]))|((29|30)[/](0[4,6,9]|11)))[/](19|[2-9][0-9]' +
')\\d\\d$)|(^29[/]02[/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|' +
'48|52|56|60|64|68|72|76|80|84|88|92|96)$)')

/**
 * getDate - Returns a formatted date for the provided date string
 * It will return an error if the date does not match the date regex
 *
 * @param  {String} str      The string containing the date in normal format
 * @param  {Callback(Result, error)} callback Returns the result and/or error
 * @return {String}          Returns a formatted string, or null
 */
function getDate (str, callback) {
  if (dateRegex.exec(str) !== null) { // Executes regex on the provided string
    var split = str.split('/') // Normal date delimiter
    var date = split[2] + '-' + split[1] + '-' + split[0] // Reverse order
    return date
  } else {
    callback(null, 'ERROR: Wrong date format "' + str + '"')
    return null
  }
}

/**
 * getFilters - Parses all the filters, and validates them
 * Note: If the type of filter is a date, it goes through extra steps to ensure
 * that the date is in the correct format for database querying (ISODate)
 *
 * @param  {String} queryFilters String containing all filters and values
 * @param  {function(result, error)} callback     Returns result and/or error
 * @return {Array}              Returns array of objects ([type] = value)
 */
function getFilters (queryFilters, callback) {
  if (queryFilters === null) {
    callback(null, null)
    return
  }
  queryFilters.shift() // Remove 'filter' part of string
  queryFilters = queryFilters[0].split(',') // Split string with ',' delimter

  var filters = {}
  for (var i = 0, len = queryFilters.length; i < len; i++) {
    var s = queryFilters[i].split('=') // Split types from their values
    var type = (function () {
      if (!filterMatches.includes(s[0])) { // Match against valid filters
        callback(null, 'ERROR: Unidentified filter "' + s[0] + '"')
      } else {
        return s[0]
      }
    }())
    var value = (function () {
      if (s[1] === undefined || s[1] === null) {
        callback(null, 'ERROR: Value not defined for filter \'' + type + '\'')
        return
      } else {
        s[1].replace(/%20/, ' ') // Replace URL whitespaces with proper spaces
      }
      if (type === 'date_range') { // For parsing dates with ranges
        var dates = s[1].split('-') // Split ranges into multiple dates
        if (dates.length !== 2) {
          callback(null, 'ERROR: Date range expected (2) entries, but got (' + dates.length + ')')
        } else {
          var sDateRange = new Date(getDate(dates[0]) + 'T00:00:00.000Z').toISOString() // Apply midnight time to date
          var eDateRange = new Date(getDate(dates[1]) + 'T23:59:59.999Z').toISOString() // Apply one-millisecond-from-midnight time to date
          var dateRangeObj = { // The filter object
            '$gte': sDateRange, // Start date range
            '$lt': eDateRange, // End date range
          }
          type = 'date' // Set type back to 'date' for use in calling table
          return dateRangeObj
        }
      } else if (type === 'date') { // For parsing date for the given day (24h)
        var dateSingle = getDate(s[1], callback)
        var sDateSingle = new Date(dateSingle + 'T00:00:00.000Z').toISOString() // Apply midnight time to date
        var eDateSingle = new Date(dateSingle + 'T23:59:59.999Z').toISOString() // Apply one-millisecond-from-midnight time to date
        var dateObj = { // The filter object
          '$gte': sDateSingle, // Start of day (midnight)
          '$lt': eDateSingle, // End of day
        }
        return dateObj
      } else {
        return s[1]
      }
    }())
    filters[type] = value
  }
  callback(filters, null)
}

/**
 * handleAPIQuery - Handles the api URL to run respective API handler
 *
 * @param  {Object} req The current request
 * @param  {Object} res The object that handles the response
 */
function handleAPIQuery (req, res) {
  var url = req.url

  if (url.match(/events\?/)) { // If URL matches 'xyz.../events?'
    handleEventQuery(url, res)
  } else {
    res.end('Unidentified query')
  }
}

/**
 * handleEventQuery - Handles the API queries for Events
 *
 * @param  {String} url The events url containing the query
 * @param  {Object} res The object that handles the response
 */
function handleEventQuery (url, res) {
  var elements = url.split('&') // Split each query element by & delimiter
  if (elements === null) {
    res.end('ERROR: No query parameters provided for \'Events\'')
    return
  }
  //  Set up null objects for query elements
  var queryEvent = null
  var queryType = null
  var queryFilters = null

  // Check each split element and see if it matches a query element
  for (var i = 0, len = elements.length; i < len; i++) {
    if (queryEvent === null) {
      queryEvent = elements[i].match(/event=(.*)/)
    }
    if (queryType === null) {
      queryType = elements[i].match(/type=(.*)/)
    }
    if (queryFilters === null) {
      queryFilters = elements[i].match(/filter:(.*)/)
    }
  }

  // null query event will stop the API, and display error
  if (queryEvent === null) {
    res.end('ERROR: No event provided (&event=eventName)')
    return
  } else {
    queryEvent = queryEvent[1]
  }

  // null query type will stop the API, and display error
  if (queryType === null) {
    res.end('ERROR: No query type provided (&type=typeName)')
    return
  } else {
    queryType = queryType[1]
  }

  // Check if the event provided matches valid event types
  if (!eventMatches.includes(queryEvent)) {
    res.end('ERROR: Unidentified event "' + queryEvent + '"')
    return
  }

  // Check if the type provded matches valid query types
  if (!typeMatches.includes(queryType)) {
    res.end('ERROR: Unidentified type "' + queryType + '"')
    // return
  }

  /**
  * Promise - To parse all filters, stopping API from querying till all
  * parsing is completed, so databse doesn't query using incomplete set
  */
  var filterPromise = new Promise((resolve, reject) => {
    getFilters(queryFilters, (filters, err) => {
      if (err) {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.write(err + '\n')
        queryFilters = {}
        res.end()
        resolve()
      } else {
        queryFilters = filters
        resolve()
      }
      reject(new Error('ERROR: Error parsing filters'))
    })
  })

  // Test for filterPromise completion, and if successful run database calls
  console.log('pre-promise')
  filterPromise.then(function () {
    switch (queryType) {
      case 'total':
        // Returns the total count of database results
        return getTotal(queryEvent, queryFilters, (results) => res.end(results))
      case 'list':
        // Returns a JSON display of all database results
        return getList(queryEvent, queryFilters, (results) => res.end(results))
    }
  }).catch(function (error) {
    // Display error if there was an unexpected filter parsing error
    res.end(error)
  })
}

export default handleAPIQuery
