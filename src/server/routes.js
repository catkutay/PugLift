import * as pkg from '../../package.json'

class Routes {
  constructor (handleEvent) {
    this.handleEvent = handleEvent
  }

  handleRoutes (req, res) {
    if (req.method === 'POST') {
      let bodyData = ''
      req.on('data', data => { bodyData += ab2str(data) })
      req.on('end', () => {
        const event = JSON.parse(bodyData)
        if (Object.keys(response).includes(req.url.substr(1))) {
          return this.handleEvent(event, response => res.end(response))
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
      } else if (req.url.match(/$\/api/)) {
        callApiIndex(req, res)
      }
      } else {
        return res.end(`404 - Unknown request by: ${req.headers['user-agent']}`)
      }
    }

    const ab2str = buf => String.fromCharCode.apply(null, new Uint8Array(buf))
  }

  handleWebsocketRoutes (ws) {
    ws.on('message', message => {
      const event = JSON.parse(message)
      if (Object.keys(response).includes(event.type)) {
        return this.handleEvent(event, response => ws.send(response))
      } else {
        return ws.send(`Unknown request by: ${ws}`)
      }
    })
  }
}

export const PORT = process.env.PORT || 3000

export const response = {
  'page_load': Buffer.from('page loaded!'),
  'bid_requests': Buffer.from('bid requests!'),
  'bid_results': Buffer.from('bid results!'),
  'creative_render': Buffer.from('creative render!'),
}

export default Routes
