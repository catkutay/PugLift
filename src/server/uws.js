import WebSocket, { http } from 'uws'
import handleRoutes from './routes'

export const httpServer = http.createServer(handleRoutes)
const server = new WebSocket.Server({ port: 65080 })

export default server
