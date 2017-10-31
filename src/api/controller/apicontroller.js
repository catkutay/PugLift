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
  'date_range',
  'session',
]

const dateRegex = new RegExp('(^(((0[1-9]|1[0-9]|2[0-8])[/](0[1-9]|1[012]))|' +
'((29|30|31)[/](0[13578]|1[02]))|((29|30)[/](0[4,6,9]|11)))[/](19|[2-9][0-9]' +
')\\d\\d$)|(^29[/]02[/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|' +
'48|52|56|60|64|68|72|76|80|84|88|92|96)$)')

function getDate (str, callback) {
  if (dateRegex.exec(str) !== null) {
    var split = str.split('/')
    var date = split[2] + '-' + split[1] + '-' + split[0]
    return date
  } else {
    callback(null, 'ERROR: Wrong date format "' + str + '" - Results un-filtered!')
    return null
  }
}

function getFilters (queryFilters, callback) {
  queryFilters.shift()
  queryFilters = queryFilters[0].split(',')

  var filters = {}
  for (var i = 0, len = queryFilters.length; i < len; i++) {
    var s = queryFilters[i].split('=')
    var type = (function () {
      if (!filterMatches.includes(s[0])) {
        callback(null, 'ERROR: Unidentified filter "' + s[0] + '" - Results un-filtered!')
      } else {
        return s[0]
      }
    }())
    var value = (function () {
      if (type === 'date_range') {
        var dates = s[1].split('-')
        if (dates.length !== 2) {
          callback(null, 'ERROR: Date range expected (2) entries, but got (' + dates.length + ') - Results un-filtered!')
        } else {
          var sDateRange = new Date(getDate(dates[0]) + 'T00:00:00.000Z').toISOString()
          var eDateRange = new Date(getDate(dates[1]) + 'T23:59:59.999Z').toISOString()
          var dateRangeObj = {
            '$gte': sDateRange,
            '$lt': eDateRange,
          }
          type = 'date'
          return dateRangeObj
        }
      } else if (type === 'date') {
        var dateSingle = getDate(s[1], callback)
        var sDateSingle = new Date(dateSingle + 'T00:00:00.000Z').toISOString()
        var eDateSingle = new Date(dateSingle + 'T23:59:59.999Z').toISOString()
        var dateObj = {
          '$gte': sDateSingle,
          '$lt': eDateSingle,
        }
        console.log('date: ' + JSON.stringify(dateObj))
        return dateObj
      } else {
        return s[1] === undefined || s[1] === null ? '' : s[1].replace(/%20/, ' ')
      }
    }())
    filters[type] = value
  }
  callback(filters, null)
}

function handleAPIQuery (req, res) {
  var url = req.url

  if (url.match(/events\?/)) {
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
    if (queryFilters === null) {
      return
    }
  }

  switch (queryType) {
    case 'total':
      return getTotal(queryEvent, queryFilters, (results) => res.end(results))
    case 'list':
      return getList(queryEvent, queryFilters, (results) => res.end(results))
  }
}

export default handleAPIQuery
