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

import config from '../configs/config'

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

server.listen(port, config.app.address)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Create a rabbitmq connection
 */
var amqpAddress = 'amqp://' + config.rabbitmq.username
amqpAddress = amqpAddress + ':' + config.rabbitmq.password
amqpAddress =
  amqpAddress + '@' + config.rabbitmq.host + ':' + config.rabbitmq.port
connect(amqpAddress, config.rabbitmq.opts, function (err, conn) {
  if (err) console.log(err)
  conn.createChannel(function (err, ch) {
    if (err) console.log(err)
    ch.assertQueue(
      config.rabbitmq.consumerQueue,
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
for (const hour in config.rabbitmq.sync.hours) {
  if (config.rabbitmq.sync.hours[hour] < 10) {
    var syncTime = '00 00 0' + config.rabbitmq.sync.hours[hour] + ' * * 0-6'
  } else {
    var syncTime = '00 00 ' + config.rabbitmq.sync.hours[hour] + ' * * 0-6'
  }

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
      timeZone: config.rabbitmq.sync.timezone,
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
