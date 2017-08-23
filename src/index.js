import rethinkdb, { connection } from './database/rethinkdb'
import server from './server/uws'

const home = Buffer.from('Hello world!')
const reqs = Buffer.from('bid requests!')
const results = Buffer.from('bid results!')
const creative = Buffer.from('creative render!')

const handlePageLoad = (data, socket) => {
  const page = Buffer.from('page loaded!')

  rethinkdb.table('session')
    .insert(data)
    .run(connection)
    .then(result => {
      console.log(JSON.stringify(result, null, 2))
      socket.send(page)
    })
    .catch(err => {
      throw err
    })
}

server.on('connection', ws => {
  ws.on('message', message => {
    switch (message.type) {
      case '': return ws.send(home)
      case 'page_load': return handlePageLoad(message.value)
      case 'bid_requests': return ws.send(reqs)
      case 'bid_results': return ws.send(results)
      case 'creative_render': return ws.send(creative)
      default: ws.send(`Unknown request by: ${ws}`)
    }
  })
})

server.on('listening', ws => {
  console.info('PubLift Analytics server started and listening for connections')
})
