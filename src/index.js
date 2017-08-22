/* eslint-disable no-unused-vars */

// import primus from './server/primus'
//
// primus.on('initialised', spark => {
//   console.log('Primus initialised')
//
//   spark.on('data', data => {
//     console.log(data)
//
//     spark.write(`${data}? That's awesome`)
//   })
// })
//
// primus.on('connection', spark => {
//   console.log('hello connection')
//
//   spark.on('data', data => {
//     console.log(data)
//
//     spark.write(`${data}? That's awesome`)
//   })
// })

import WebSocket from 'uws'
import http from './server/uws'
import handleRoutes, { PORT } from './server/routes'

// const app = http.createServer(handleRoutes)

const server = new WebSocket.Server({ port: PORT })

const home = Buffer.from('Hello world!')
const page = Buffer.from('page loaded!')
const reqs = Buffer.from('bid requests!')
const results = Buffer.from('bid results!')
const creative = Buffer.from('creative render!')

server.on('connection', ws => {
  ws.on('message', message => {
    switch (message.type) {
      case '': return ws.send(home)
      case 'page_load': return ws.send(page)
      case 'bid_requests': return ws.send(reqs)
      case 'bid_results': return ws.send(results)
      case 'creative_render': return ws.send(creative)
      default: ws.send(`Unknown request by: ${ws}`)
    }
  })
})
