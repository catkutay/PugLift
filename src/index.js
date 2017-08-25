import rethinkdb, { connection } from './database/rethinkdb'
import server, { httpServer } from './server/uws'
import { PORT } from './server/routes'
import * as json from '../package.json'

const home = Buffer.from(`Running Publift Analytics v${json.version}`)

const handleEvent = (data, socket) => {
  const response = {
    'page_load': Buffer.from('page loaded!'),
    'bid_requests': Buffer.from('bid requests!'),
    'bid_results': Buffer.from('bid results!'),
    'creative_render': Buffer.from('creative render!'),
  }

  rethinkdb.table('session')
    .insert(data.value)
    .run(connection)
    .then(result => {
      // console.log(JSON.stringify(result, null, 2))
      socket.send(response[data.type])
    })
    .catch(err => {
      throw err
    })
}

httpServer.listen(PORT)

server.on('connection', ws => {
  ws.on('message', message => {
    const event = JSON.parse(message)
    switch (event.type) {
      case '': return ws.send(home)
      case 'page_load': return handleEvent(event, ws)
      case 'bid_requests': return handleEvent(event, ws)
      case 'bid_results': return handleEvent(event, ws)
      case 'creative_render': return handleEvent(event, ws)
      default: ws.send(`Unknown request by: ${ws}`)
    }
  })
})

server.on('listening', ws => {
  console.info('PubLift Analytics server started and listening for connections')
})
