import server from './server/uws'

const home = Buffer.from('Hello world!')
const page = Buffer.from('page loaded!')
const reqs = Buffer.from('bid requests!')
const results = Buffer.from('bid results!')
const creative = Buffer.from('creative render!')

server.on('connection', ws => {
  ws.on('message', message => {
    switch (message.type) {
      case '': return ws.send(home)
      case 'page_load': return ws.send(page)
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
