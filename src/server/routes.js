import * as pkg from '../../package.json'
import { profileLogger, enableProfilling } from '../winstonconfig'
// import { logger } from '../winstonconfig'

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
        if (Object.keys(response).includes(req.url.substr(1))) {
          const uniqueID = (process.hrtime()[1]) // creating a uniqueID using nanoseconds.
          if (enableProfilling) { profileLogger.profile(uniqueID) } // start timer with uniqueID
          return this.handleEvent(event, response => res.end(response), uniqueID) // return data for database insertion
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
