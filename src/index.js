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

server.on('connection', ws => {
  ws.on('message', message => {
    console.log(`received: ${message}`)

    ws.send('something')
  })
})
