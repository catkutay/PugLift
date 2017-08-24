import WebSocket, { http } from 'uws'
import handleRoutes, { PORT } from './routes'

const httpServer = http.createServer(handleRoutes).listen(PORT)
const server = new WebSocket.Server({ server: httpServer, port: 65080 })

export default server
