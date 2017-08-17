import primus from '../server/primus'

const Socket = primus.Socket()

Socket.on('connection', spark => {
  console.log('connected')
  spark.on('data', data => console.log(data))

  spark.write('hello world')
})

console.log('here')
