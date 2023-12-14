/**
 * Module dependencies.
 */

import app from '../app'
import { createServer } from 'http'

/**
 * Get port from environment and store in Express.
 */

const port = process.env.SERVER_PORT || 8000
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  console.log('Listening on ' + bind)
}

process.on('SIGTERM', shutDown)
process.on('SIGINT', shutDown)

function shutDown() {
  console.log('Received kill signal, shutting down gracefully')
  if (app.locals.connection) {
    app.locals.connection.close()
  }
  server.close(() => {
    console.log('Http server closed.')
    process.exit(0)
  })
}
