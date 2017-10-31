import { getTotal, getList } from '../database/mongodbproxy'
var eventMatches = [
  'page_load',
  'bid_request',
  'bid_response',
  'ad_request',
  'ad_response',
  'ad_view',
  'creative_render',
]

// e.g. Total entires for a user (showing every user unless filtered)
var typeMatches = [
  'total',
  'total_by_user',
  'total_by_url',
  'total_by_ad_unit',
  'total_by_session',
  'list',
]

var filterMatches = [
  'user_id',
  'event_type',
  'date',
  'session',
]

/*
function validateParameter (str, arr) {
  for (var i = 0, len = arr.length; i < len; i++) {
    if (str === arr[i]) {
      return true
    }
  }
  return false
}
*/

function getFilters (queryFilters, callback) {
  queryFilters.shift()
  queryFilters = queryFilters[0].split(',')

  var filters = {}
  for (var i = 0, len = queryFilters.length; i < len; i++) {
    var s = queryFilters[i].split('=')
    var o = {
      type: (function () {
        if (!filterMatches.includes(s[0])) {
          callback(null, 'ERROR: Unidentified filter "' + s[0] + '" - Results un-filtered!')
        } else {
          return s[0]
        }
      }()),
      value: s[1] === undefined || s[1] === null ? '' : s[1].replace(/%20/, ' '),
    }
    // filters.push(o)
    filters[o.type] = o.value
  }
  callback(filters, null)
}

function handleAPIQuery (req, res) {
  var url = req.url

  if (url.match(/events\?/)) {
  // url/api/events/event_name/query_type/optional_filter
  // url/api/events/&event=page_load&type=total_by_user&filter:date=1/7/17-1/12/17
  // get filters - date &filter=??
  // date ranges 1/2/17 - 1/7/17
  // Time to date : From date till now
  // Today
    handleEventQuery(url, res)
  } else {
    res.end('Unidentified query')
  }
}

function handleEventQuery (url, res) {
  var elements = url.split('&')
  if (elements === null) {
    res.end('ERROR: No query parameters provided for \'Events\'')
    return
  }
  var queryEvent = null
  var queryType = null
  var queryFilters = null

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

  if (queryEvent === null) {
    res.end('ERROR: No event provided (&event=eventName)')
    return
  } else {
    queryEvent = queryEvent[1]
  }

  if (queryType === null) {
    res.end('ERROR: No query type provided (&type=typeName)')
    return
  } else {
    queryType = queryType[1]
  }

  if (!eventMatches.includes(queryEvent)) {
    res.end('ERROR: Unidentified event "' + queryEvent + '"')
    return
  }

  if (!typeMatches.includes(queryType)) {
    res.end('ERROR: Unidentified type "' + queryType + '"')
    // return
  }

  if (queryFilters !== null) {
    getFilters(queryFilters, (filters, err) => {
      if (err) {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.write(err + '\n')
        queryFilters = {}
      } else {
        queryFilters = filters
      }
    })
  }

  switch (queryType) {
    case 'total':
      return getTotal(queryEvent, queryFilters, (results) => res.end(results))
    case 'list':
      return getList(queryEvent, queryFilters, (results) => res.end(results))
  }
}

export default handleAPIQuery
