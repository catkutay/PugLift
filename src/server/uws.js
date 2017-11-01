// eslint-disable-next-line no-unused-vars
// import WebSocket, { http } from 'uws'
import http from 'http'
import { PORT } from './routes'

const uws = routes => {
  const httpServer = http.createServer((req, res) => routes.handleRoutes(req, res))
  httpServer.listen(PORT)

  // const server = new WebSocket.Server({ port: 65080 })
  // server.on('connection', ws => routes.handleWebsocketRoutes(ws))
  // server.on('listening', () => {
  //   console.info('PubLift Analytics server started and listening for connections')
  // })
}

export default uws
