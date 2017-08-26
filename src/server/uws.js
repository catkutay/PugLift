import WebSocket, { http } from 'uws'
import { PORT } from './routes'

const uws = routes => {
  const httpServer = http.createServer(routes.handleRoutes)
  const server = new WebSocket.Server({ port: 65080 })

  httpServer.listen(PORT)

  server.on('connection', ws => routes.handleWebsocketRoutes(ws))

  server.on('listening', () => {
    console.info('PubLift Analytics server started and listening for connections')
  })
}

export default uws
