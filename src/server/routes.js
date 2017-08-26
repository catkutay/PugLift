import * as json from '../../package.json'

class Routes {
  constructor (handleEvent) {
    this.handleEvent = handleEvent
    this.home = Buffer.from(`Running Publift Analytics v${json.version}`)
  }

  handleRoutes (req, res) {
    console.log(req)
    if (Object.keys(response).includes(req.url.substr(1))) {
      return this.handleEvent(req, response => res.end(response))
    } else if (req.url.substr(1) === '/') {
      return res.end(this.home)
    } else {
      return res.end(`Unknown request by: ${req.headers['user-agent']}`)
    }
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
