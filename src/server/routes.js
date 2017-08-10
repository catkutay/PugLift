const document = Buffer.from('Hello world!')

const handleRoutes = (req, res) => {
  if (req.method === 'POST') {
    let body = []
    req.on('data', (chunk) => {
      body.push(Buffer.from(chunk))
    }).on('end', () => {
      res.end(`You posted me this: ${Buffer.concat(body).toString()}`)
    })
    // handle some GET url
  } else if (req.url === '/') {
    res.end(document)
  } else {
    res.end(`Unknown request by: ${req.headers['user-agent']}`)
  }
}

export default handleRoutes
