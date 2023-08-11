import { Router } from 'express'
import { ObjectId } from 'mongodb'
import { connect } from 'amqplib/callback_api'
import co from 'co'
import uuidV4 from 'uuid/v4'
import { getConfigSchema } from '../utils/routerUtil'

import ensureAuthenticated from '../utils/passport/ensure-authenticated'
import ensureAdmin from '../utils/passport/ensure-admin'
import ensureUser from '../utils/passport/ensure-user'

import config from '../configs/config'
import basePathConfig from '../configs/basePathConfig'
import ApiUsersController from '../controllers/apiUsersController'
import { v1Routes } from '../utils/routes'

const router = Router()

const basePath = basePathConfig || ''

let rabbitmq_conn
connect(process.env.RABBIT_ADDRESS, config.rabbitmq.opts, function (err, conn) {
  if (err) console.log(err)
  rabbitmq_conn = conn
})

//Admin privilege checking middleware

//Check if the information requested is for the user

//Check user privilege for the study
function ensurePermission(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect(`${basePath}/logout`)
  }
  const { appDb } = req.app.locals
  appDb
    .collection('users')
    .findOne(
      { uid: req.user },
      { _id: 0, access: 1, blocked: 1, role: 1 },
      function (err, data) {
        if (err) {
          console.log(err)
          return res.redirect(`${basePath}/?e=forbidden`)
        } else if (!data || Object.keys(data).length === 0) {
          return res.redirect(`${basePath}/?e=forbidden`)
        } else if ('role' in data && data['role'] === 'admin') {
          return next()
        } else if ('blocked' in data && data['blocked'] == true) {
          return res.redirect(`${basePath}/logout?e=forbidden`)
        } else if (!('access' in data) || data.access.length == 0) {
          return res.redirect(`${basePath}/logout?e=unauthorized`)
        } else if (data.access.indexOf(req.params.study) < 0) {
          return res.redirect(`${basePath}/?e=forbidden`)
        } else {
          return next()
        }
      }
    )
}

//deepdive page
router.get(
  '/api/v1/studies/:study/subjects/:subject/deepdive/:day',
  ensurePermission,
  function (req, res) {
    const { dataDb } = req.app.locals
    dataDb
      .collection('toc')
      .find({
        study: req.params.study,
        subject: req.params.subject,
        assessment: {
          $regex: /^Deepdive/,
        },
      })
      .toArray(function (err, docs) {
        if (err) {
          console.log(err)
          return res.status(502).send([])
        } else if (docs.length == 0) {
          return res.status(404).send([])
        } else {
          co(function* () {
            var dataPiece = []
            for (var doc = 0; doc < docs.length; doc++) {
              var data = yield dataDb
                .collection(docs[doc].collection)
                .find({
                  day: parseInt(req.params.day),
                })
                .toArray()
              Array.prototype.push.apply(dataPiece, data)
            }
            return res.status(201).send(dataPiece)
          })
        }
      })
  }
)

router
  .route('/resync/:study/:subject')
  .post(ensureAuthenticated, function (req, res) {
    var rootdir = config.app.rootDir
    var syncdir =
      rootdir + '/' + req.params.study + '/' + req.params.subject + '/'
    if (rabbitmq_conn) {
      rabbitmq_conn.createChannel(function (err, ch) {
        if (err) {
          console.log(err)
          try {
            connect(amqpAddress, config.rabbitmq.opts, function (err, conn) {
              rabbitmq_conn = conn
            })
          } catch (err) {
            console.log(err)
            process.exit(1)
          }
        }
        ch.assertQueue(
          config.rabbitmq.consumerQueue,
          { durable: false },
          function (err, q) {
            var correlationId = uuidV4()
            publisher(
              rabbitmq_conn,
              ch,
              correlationId,
              [
                syncdir,
                rootdir,
                '',
                '',
                config.database.mongo.username,
                config.database.mongo.password,
                config.database.mongo.host,
                config.database.mongo.port,
                config.database.mongo.authSource,
                config.database.mongo.dataDB,
              ],
              q.queue
            )
            return res.status(201).send({ correlationId: correlationId })
          }
        )
      })
    }
  })

function publisher(conn, ch, correlationId, args, replyTo) {
  var message = {}
  message.id = correlationId
  message.task = 'import'
  message.args = args
  message.kwargs = {}
  message.retries = 1

  ch.sendToQueue(
    config.rabbitmq.publisherQueue,
    new Buffer(JSON.stringify(message)),
    {
      correlationId: correlationId,
      contentType: 'application/json',
      replyTo: replyTo,
    }
  )

  setTimeout(function () {
    ch.close()
  }, 500)
}

router.route('/api/v1/studies').get(ensureAuthenticated, function (req, res) {
  const { appDb } = req.app.locals
  appDb
    .collection('users')
    .findOne({ uid: req.user }, { _id: 0, access: 1 }, function (err, data) {
      if (err) {
        console.log(err)
        return res.status(502).send([])
      } else if (!data || Object.keys(data).length == 0) {
        return res.status(404).send([])
      } else if (!('access' in data) || data.access.length == 0) {
        return res.status(404).send([])
      } else {
        return res.status(200).json(data.access.sort())
      }
    })
})

router.get('/api/v1/search/studies', ensureAuthenticated, function (req, res) {
  const { dataDb } = req.app.locals
  dataDb.collection('toc').distinct('study', function (err, studies) {
    if (err) {
      console.log(err)
      return res.status(502).send([])
    } else if (!studies || studies.length == 0) {
      return res.status(404).send([])
    } else {
      return res.status(200).send(studies)
    }
  })
})

router.get('/api/v1/subjects', ensureAuthenticated, function (req, res) {
  const { dataDb } = req.app.locals
  dataDb
    .collection('metadata')
    .aggregate([
      { $match: { study: { $in: JSON.parse(req.query.q) } } },
      {
        $addFields: {
          numOfSubjects: { $size: { $ifNull: ['$subjects', []] } },
        },
      },
      { $sort: { study: 1 } },
    ])
    .toArray(function (err, subjects) {
      if (err) {
        console.log(err)
        return res.status(502).send([])
      } else if (!subjects) {
        return res.status(502).send([])
      } else {
        return res.status(200).json(subjects)
      }
    })
})

router.get(v1Routes.users.index, ensureAdmin, ApiUsersController.index)
router.get('/api/v1/search/users', ensureAuthenticated, function (req, res) {
  const { appDb } = req.app.locals
  appDb
    .collection('users')
    .find({}, { uid: 1 })
    .toArray(function (err, users) {
      if (err) {
        console.log(err)
        return res.status(502).send([])
      } else if (!users || users.length == 0) {
        return res.status(404).send([])
      } else {
        return res.status(200).send(
          users.map(function (u) {
            return u.uid
          })
        )
      }
    })
})

router
  .route('/api/v1/users/:uid/resetpw')
  .post(ensureAdmin, function (req, res) {
    const { appDb } = req.app.locals

    if (
      Object.prototype.hasOwnProperty.call(req.body, 'force_reset_pw') &&
      Object.prototype.hasOwnProperty.call(req.body, 'reset_key')
    ) {
      appDb.collection('users').findOneAndUpdate(
        { uid: req.params.uid },
        {
          $set: {
            force_reset_pw: req.body.force_reset_pw,
            reset_key: req.body.reset_key,
          },
        },
        { returnOriginal: false },
        function (err) {
          if (err) {
            console.log(err)
            return res.status(502).send({ message: 'fail' })
          } else {
            return res.status(201).send({ message: 'success' })
          }
        }
      )
    } else {
      return res.status(502).send({ message: 'fail' })
    }
  })

router
  .route('/api/v1/users/:uid/delete')
  .post(ensureAdmin, function (req, res) {
    const { appDb } = req.app.locals
    appDb
      .collection('users')
      .deleteOne({ uid: req.params.uid }, function (err) {
        if (err) {
          console.log(err)
          return res.status(502).send({ message: 'fail' })
        } else {
          return res.status(201).send({ message: 'success' })
        }
      })
  })

router
  .route('/api/v1/users/:uid/role')
  .get(ensureAdmin, function (req, res) {
    const { appDb } = req.app.locals
    appDb
      .collection('users')
      .findOne(
        { uid: req.params.uid },
        { _id: 0, role: 1 },
        function (err, data) {
          if (err) {
            console.log(err)
            return res.status(502).send(null)
          } else if (!data || Object.keys(data).length === 0) {
            return res.status(404).send(null)
          } else {
            return res.status(200).json(data['uid'])
          }
        }
      )
  })
  .post(ensureAdmin, function (req, res) {
    if (Object.prototype.hasOwnProperty.call(req.body, 'role')) {
      const { appDb } = req.app.locals
      appDb
        .collection('users')
        .findOneAndUpdate(
          { uid: req.params.uid },
          { $set: { role: req.body.role } },
          { returnOriginal: false },
          function (err) {
            if (err) {
              console.log(err)
              return res.status(502).send({ message: 'fail' })
            } else {
              return res.status(201).send({ message: 'success' })
            }
          }
        )
    } else {
      return res.status(502).send({ message: 'fail' })
    }
  })

router
  .route('/api/v1/users/:uid/blocked')
  .get(ensureAdmin, function (req, res) {
    const { appDb } = req.app.locals
    appDb
      .collection('users')
      .findOne(
        { uid: req.params.uid },
        { _id: 0, blocked: 1 },
        function (err, data) {
          if (err) {
            console.log(err)
            return res.status(502).send(null)
          } else if (!data || Object.keys(data).length === 0) {
            return res.status(404).send(null)
          } else {
            return res.status(200).json(data['blocked'])
          }
        }
      )
  })
  .post(ensureAdmin, function (req, res) {
    if (Object.prototype.hasOwnProperty.call(req.body, 'blocked')) {
      const { appDb } = req.app.locals
      appDb
        .collection('users')
        .findOneAndUpdate(
          { uid: req.params.uid },
          { $set: { blocked: req.body.blocked } },
          { returnOriginal: false },
          function (err) {
            if (err) {
              console.log(err)
              return res.status(502).send({ message: 'fail' })
            } else {
              return res.status(201).send({ message: 'success' })
            }
          }
        )
    } else {
      return res.status(502).send({ message: 'fail' })
    }
  })

router
  .route('/api/v1/users/:uid/studies')
  .get(ensureAdmin, function (req, res) {
    const { appDb } = req.app.locals
    appDb
      .collection('users')
      .findOne({ uid: req.params.uid }, { _id: 0, access: 1 }, function (err) {
        if (err) {
          console.log(err)
          return res.status(502).send({ message: 'fail' })
        } else {
          return res.status(201).send({ message: 'success' })
        }
      })
  })
  .post(ensureAdmin, function (req, res) {
    if (Object.prototype.hasOwnProperty.call(req.body, 'acl')) {
      const { appDb } = req.app.locals
      appDb
        .collection('users')
        .findOneAndUpdate(
          { uid: req.params.uid },
          { $set: { access: req.body.acl } },
          { returnOriginal: false },
          function (err) {
            if (err) {
              console.log(err)
              return res.status(502).send({ message: 'fail' })
            } else {
              return res.status(201).send({ message: 'success' })
            }
          }
        )
    } else {
      return res.status(502).send({ message: 'fail' })
    }
  })

router
  .route('/api/v1/users/:uid/configs/:config_id')
  .get(ensureUser, function (req, res) {
    const { appDb } = req.app.locals
    appDb
      .collection('configs')
      .findOne(
        { readers: req.params.uid, _id: new ObjectId(req.params.config_id) },
        function (err, data) {
          if (err) {
            console.log(err)
            return res.status(502).send({})
          } else if (!data || Object.keys(data).length === 0) {
            return res.status(404).send({})
          } else {
            return res.status(200).json(data)
          }
        }
      )
  })

router
  .route('/api/v1/users/:uid/preferences')
  .get(ensureUser, function (req, res) {
    const { appDb } = req.app.locals
    appDb
      .collection('users')
      .findOne(
        { uid: req.params.uid },
        { _id: 0, preferences: 1 },
        function (err, data) {
          if (err) {
            console.log(err)
            return res.status(502).send({})
          } else if (!data || Object.keys(data).length === 0) {
            return res.status(404).send({})
          } else {
            return res.status(200).json(data['preferences'])
          }
        }
      )
  })
  .post(ensureUser, function (req, res) {
    if (Object.prototype.hasOwnProperty.call(req.body, 'preferences')) {
      const { appDb } = req.app.locals
      appDb
        .collection('users')
        .findOneAndUpdate(
          { uid: req.params.uid },
          { $set: { preferences: req.body.preferences } },
          { returnOriginal: false },
          function (err, doc) {
            if (err) {
              console.log(err)
              return res.status(502).send({ message: 'fail' })
            } else if (!doc) {
              return res.status(404).send({ message: 'fail' })
            } else {
              return res.status(201).send({ message: 'success' })
            }
          }
        )
    } else {
      console.log('No property known as configurations.')
      return res.status(502).send({ message: 'fail' })
    }
  })

router
  .route('/api/v1/users/:uid/config/file')
  .post(ensureUser, async function (req, res) {
    const { appDb } = req.app.locals

    if (req.body && req.body.config) {
      try {
        let data = req.body.config
        const defaultColors = [
          '#4575b4',
          '#74add1',
          '#abd9e9',
          '#e0f3f8',
          '#ffffbf',
          '#fee090',
          '#fdae61',
          '#f46d43',
          '#d73027',
        ]

        if (Array.isArray(data)) {
          data.forEach((element) => {
            if (!element.color) {
              element.color = defaultColors
            }
          })
        } else {
          return res.status(400).send()
        }

        let schema = getConfigSchema()

        const dataFitToSchema = schema.cast(data)
        if (dataFitToSchema === null) {
          return res.status(400).send()
        }

        await schema.validate(dataFitToSchema)

        const newConfig = {
          owner: req.user,
          config: { 0: dataFitToSchema },
          name: req.body.name || 'Untitled',
          type: 'matrix',
          readers: [req.user],
          created: new Date().toUTCString(),
        }
        await appDb.collection('configs').insertOne(newConfig)
        return res.status(200).send()
      } catch (err) {
        if (err.name === 'ValidationError') {
          return res.status(400).send()
        } else {
          console.log('Error occurred while uploading a configuration file.')
          console.error(err)
          return res.status(500).send()
        }
      }
    } else {
      return res.status(500).send()
    }
  })

export default router
