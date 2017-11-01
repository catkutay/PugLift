import moment from 'moment'
import uuidv5 from 'uuid/v5'
import * as pkg from '../../package.json'
import { profileLogger, enableProfiling, consoleloggingLevel, fileLoggingLevel, setProfiling } from '../winstonconfig'
import handleAPIQuery from '../../src/api/controller/apicontroller'

class Routes {
  constructor (handleEvent) {
    this.handleEvent = handleEvent
  }

  handleRoutes (req, res) {
    if (req.method === 'POST') {
      let bodyData = ''
      req.on('data', data => { bodyData += ab2str(data) })

      req.on('end', () => {
        const event = safeParse(bodyData)
        if (event === null) {
          return res.end(`Invalid data from: ${req.headers['user-agent']}`)
        }
        const eventUserID = event.value.user_id

        if (['0', null, 0, 'undefined', ' ', ''].includes(eventUserID)) {
          let newUserID = uuidv5(moment().format('Y-MM-DD HH:mm:SSSSSS'), 'ddb8d97f-f9b2-4a9c-a77c-b08689136db8') //  creates a v5 uuid using date, hour, minute, and nano seconds
          event.value.user_id = `${newUserID}`
        }

        if (Object.keys(response).includes(req.url.substr(1)) && Object.keys(response).includes(event.type)) {
          if (enableProfiling) {
            const profilingID = (process.hrtime()[1]) // creating a unique ID for profilling purposes using nanoseconds.
            profileLogger.profile(profilingID) // start timer with unique profilling ID
            return this.handleEvent(event, profilingID, (response, userid) => res.end(response + userid))
          } else {
            return this.handleEvent(event, null, (response, userid) => res.end(response + userid))
          }
        } else {
          return res.end(`Unknown request by: ${req.headers['user-agent']}`)
        }
      })
    } else {
      if (req.url === '/') {
        return res.end(
          Buffer.from(
            `Running Publift Analytics v${pkg.version}${pkg.config.branch === 'master' ? '' : ' from branch ' + pkg.config.branch}`
          )
        )
      } else if (req.url.match(/api/)) {
        handleAPIQuery(req, res)
      } else if (req.url === '/loggersettings') {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.write('Current console logging level is: ' + consoleloggingLevel + '\n')
        res.write('Current file logging level is: ' + fileLoggingLevel + '\n')
        res.write('Profilling enabled: ' + enableProfiling + '\n' + '\n')
        res.end()
      } else if (req.url === '/loggersettings/profiling/on') {
        setProfiling(true)
        res.end('Profiling has been turned on, all legitimate event requests will be logged to the winston-profile-events.log file')
      } else if (req.url === '/loggersettings/profiling/off') {
        setProfiling(false)
        res.end('Profiling has been turned off')
      } else {
        return res.end(Buffer.from(`404 - Unknown request by: ${req.headers['user-agent']}`))
      }
    }
    const ab2str = buf => String.fromCharCode.apply(null, new Uint8Array(buf))

    const safeParse = data => {
      try {
        return JSON.parse(
          data
            // catch invalid keys or potential MongoDB query operators starting with '$' and add 'a' as prefix: '$where' -> 'a$where'; [$where] -> [a$where]; " $where " -> " a$where "
            .replace(/(['"[][\s]*)(\$[\w]*)([\s]*['"\]])/g, '$1a$2$3')
            // catch invalid keys containing a dot (.) and replace with a hyphen (-): 'test.key' -> 'test-key'
            // Note: does not handle multiple scattered dots within one key, e.g. 'an.example.key'
            .replace(/(['"][\s]*[\w]*)(\.+)([\w]*[\s]*['"]:)/g, '$1-$3')
            // catch null bytes and replace with string 'none': 'example\u0000' -> 'examplenone'
            .replace(/\u0000|\\u0000/g, 'none')
        )
      } catch (err) {
        return null
      }
    }
  }
}

export const PORT = process.env.PORT || 3000

export const response = {
  'page_load': Buffer.from('page loaded!'),
  'bid_request': Buffer.from('bid requested!'),
  'bid_response': Buffer.from('bid result!'),
  'ad_request': Buffer.from('ad requested!'),
  'ad_response': Buffer.from('ad result!'),
  'ad_view': Buffer.from('ad viewed!'),
  'creative_render': Buffer.from('creative render!'),
}

export default Routes
