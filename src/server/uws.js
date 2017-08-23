import WebSocket from 'uws'
import { PORT } from './routes'

const server = new WebSocket.Server({ port: PORT })

export default server
