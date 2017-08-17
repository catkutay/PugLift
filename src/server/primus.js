import Primus from 'primus'
import WebSocket from 'uws'
import { PORT } from './routes'

const server = new WebSocket.Server({ port: PORT })

const primus = new Primus(server, { transformer: 'uws' })

export default primus
