const home = Buffer.from('Hello world!')
const page = Buffer.from('page loaded!')
const reqs = Buffer.from('bid requests!')
const results = Buffer.from('bid results!')
const creative = Buffer.from('creative render!')

const handleRoutes = (req, res) => {
  switch (req.url) {
    case '/': return res.end(home)
    case '/page_load': return res.end(page)
    case '/bid_requests': return res.end(reqs)
    case '/bid_results': return res.end(results)
    case '/creative_render': return res.end(creative)
    default: res.end(`Unknown request by: ${req.headers['user-agent']}`)
  }
}

export default handleRoutes
