/**
 * Module dependencies.
 */

import app from '../app'
import { createServer } from 'http'
import { connect } from 'amqplib/callback_api'
import { CronJob } from 'cron'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

const debug = require('debug')('po:server')
const rabbitOptions = {}
const rabbitSync = { hours: [1], timezone: '' }
const serverListenAddress = '0.0.0.0'

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

server.listen(port, serverListenAddress)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Create a rabbitmq connection
 */
connect(process.env.RABBIT_ADDRESS, rabbitOptions, function (err, conn) {
  if (err) console.log(err)
  conn.createChannel(function (err, ch) {
    if (err) console.log(err)
    ch.assertQueue(
      process.env.RABBIT_CONSUMER_QUEUE,
      { durable: false },
      function (err, q) {
        if (err) console.log(err)
      }
    )
  })
})

/*
 * Set up crons for data and acl import
 */
for (const hour in rabbitSync.hours) {
  const syncTime =
    rabbitSync.hours[hour] < 10
      ? '00 00 0' + rabbitSync.hours[hour] + ' * * 0-6'
      : '00 00 ' + rabbitSync.hours[hour] + ' * * 0-6'

  const importerPath = path.join(__dirname, '..', 'utils', 'importer.js')

  if (fs.existsSync(importerPath)) {
    new CronJob({
      cronTime: syncTime,
      onTick: function () {
        var importer = spawn('node', [importerPath])

        importer.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`)
        })

        importer.stderr.on('data', (data) => {
          console.log(`stderr: ${data}`)
        })

        importer.on('close', (code) => {
          console.log(`child process exited with code ${code}`)
        })
      },
      start: true,
      timeZone: rabbitSync.timezone,
    })
  }
}

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
  debug('Listening on ' + bind)
}
