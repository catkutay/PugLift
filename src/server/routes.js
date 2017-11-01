import fs from 'fs'
import path from 'path'
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
        if (Object.keys(response).includes(req.url.substr(1)) && Object.keys(response).includes(event.type)) {
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
      } else if (req.url === '/loaderio-af0883d94320b9a9907450652cbd426c') {
        res.writeHead(200, {
          'Content-Type': 'text/plain',
        })

        const readStream = fs.createReadStream(path.join(__dirname, '/public/verification_file'))
        return readStream.pipe(res)
      } else {
        return res.end(Buffer.from(`404 - Unknown request by: ${req.headers['user-agent']}`))
      }
    }

    const ab2str = buf => String.fromCharCode.apply(null, new Uint8Array(buf))
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
