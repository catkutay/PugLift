import http from './server/uws'
import handleRoutes from './server/routes'

const PORT = process.env.PORT || 3000

const server = http.createServer(handleRoutes)

server.listen(PORT)
