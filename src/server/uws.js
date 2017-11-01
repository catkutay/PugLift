import { http } from 'uws'
import { PORT } from './routes'

const uws = routes => {
  const httpServer = http.createServer((req, res) => routes.handleRoutes(req, res))
  console.log('Listening on ' + PORT)
  httpServer.listen(PORT)
}

export default uws
