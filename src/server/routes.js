import moment from 'moment'
import uuidv5 from 'uuid/v5'
import * as pkg from '../../package.json'
import { profileLogger, enableProfiling, consoleloggingLevel, fileLoggingLevel, setProfiling } from '../winstonconfig'

class Routes {
  constructor (handleEvent) {
    this.handleEvent = handleEvent
  }

  handleRoutes (req, res) {
    // if (req.url === '/') {
    //   return res.end(
    //     Buffer.from(
    //       `Running Publift Analytics v${pkg.version}${pkg.config.branch === 'master' ? '' : ' from branch ' + pkg.config.branch}`
    //     )
    //   )
    // } else {
    //   res.statusCode = 200
    //   return res.end('success')
    // }

    if (req.method === 'POST') {
      let bodyData = ''
      req.on('data', data => { bodyData += ab2str(data) })
      req.on('end', () => {
        const event = JSON.parse(bodyData)
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
      } else if (req.url === '/loggersettings') {
        let profileResult = ''
        if (enableProfiling) {
          profileResult = 'enabled'
        } else {
          profileResult = 'disabled'
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.write('Current console logging level is: ' + consoleloggingLevel + '\n')
        res.write('Current file logging level is: ' + fileLoggingLevel + '\n')
        res.write('Profilling status: ' + profileResult + '\n' + '\n')
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
  }

  // handleWebsocketRoutes (ws) {
  //   ws.on('message', message => {
  //     const event = JSON.parse(message)
  //     if (Object.keys(response).includes(event.type)) {
  //       return this.handleEvent(event, response => ws.send(response))
  //     } else {
  //       return ws.send(`Unknown request by: ${ws}`)
  //     }
  //   })
  // }
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
