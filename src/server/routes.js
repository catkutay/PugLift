import fs from 'fs'
import path from 'path'
import * as pkg from '../../package.json'

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
        const event = safeParse(bodyData)
        if (event === null) {
          res.end(`Invalid data from: ${req.headers['user-agent']}`)
        } else {
          if (Object.keys(response).includes(req.url.substr(1)) && Object.keys(response).includes(event.type)) {
            return this.handleEvent(event, response => res.end(response))
          } else {
            return res.end(`Unknown request by: ${req.headers['user-agent']}`)
          }
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
