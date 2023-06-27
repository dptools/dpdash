import { Router } from 'express'
import { ObjectId } from 'mongodb'
import { connect } from 'amqplib/callback_api'
import co from 'co'
import { createHash } from 'crypto'
import uuidV4 from 'uuid/v4'
import passport from 'passport'
import { hash } from '../utils/crypto/hash'
import {
  getConfigSchema,
  getConfigForUser,
  getDashboardState,
  filterSubjectsByConsentDate,
} from '../utils/routerUtil'
import { collections } from '../utils/mongoCollections'

import LDAP from '../utils/passport/ldap'
import LocalLogin from '../utils/passport/local-login'
import LocalSignup from '../utils/passport/local-signup'
import ensureAuthenticated from '../utils/passport/ensure-authenticated'
import ensureAdmin from '../utils/passport/ensure-admin'
import ensureUser from '../utils/passport/ensure-user'

import userPage from '../templates/Account.template'
import adminPage from '../templates/Admin.template'
import configPage from '../templates/Config.template'
import deepdivePage from '../templates/DeepDive.template'
import editConfig from '../templates/EditConfig.template'
import graphPage from '../templates/Graph.template'
import loginPage from '../templates/Login.template'
import mainPage from '../templates/Main.template'
import registerPage from '../templates/Register.template'
import resetPage from '../templates/Resetpw.template'
import studyPage from '../templates/Study.template'
import reportsListPage from '../templates/ReportsList.template'
import editReportPage from '../templates/EditReport.template'
import viewReportPage from '../templates/Report.template'
import studyDetailsPage from '../templates/StudyDetails.template'

import config from '../configs/config'
import defaultStudyConfig from '../configs/defaultStudyConfig'
import defaultUserConfig from '../configs/defaultUserConfig'
import basePathConfig from '../configs/basePathConfig'

const router = Router()

const basePath = basePathConfig || ''

var amqpAddress =
  'amqp://' +
  config.rabbitmq.username +
  ':' +
  config.rabbitmq.password +
  '@' +
  config.rabbitmq.host +
  ':' +
  config.rabbitmq.port
let rabbitmq_conn
connect(amqpAddress, config.rabbitmq.opts, function (err, conn) {
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
//Home
router.get('/', ensureAuthenticated, function (req, res) {
  return res.send(
    mainPage(
      req.user,
      req.session.display_name,
      req.session.role,
      req.session.icon
    )
  )
})

//User Home
router.route('/u').get(ensureAuthenticated, function (req, res) {
  return res
    .status(200)
    .send(
      userPage(
        req.user,
        req.session.display_name,
        req.session.icon,
        req.session.mail,
        req.session.role
      )
    )
})

//User Configuration
router.route('/u/configure').get(ensureAuthenticated, function (req, res) {
  if (req.query.s && req.query.id) {
    return res.status(200).send(editConfig(req.user, req.query.s, req.query.id))
  } else if (req.query.s) {
    return res.status(200).send(editConfig(req.user, req.query.s, null))
  } else if (req.query.u) {
    let message = req.query.u
    if (req.query.u == 'invalid') {
      message = 'Invalid configuration format.'
    } else if (req.query.u == 'error') {
      message = 'Error occurred while uploading the configuration.'
    } else if (req.query.u == 'success') {
      message = 'Configuration upload successful!'
    }
    return res
      .status(200)
      .send(
        configPage(
          req.user,
          req.session.display_name,
          req.session.icon,
          req.session.mail,
          req.session.role,
          message
        )
      )
  } else {
    return res
      .status(200)
      .send(
        configPage(
          req.user,
          req.session.display_name,
          req.session.icon,
          req.session.mail,
          req.session.role,
          ''
        )
      )
  }
})

//Admin Home
router.route('/admin').get(ensureAdmin, function (req, res) {
  return res
    .status(200)
    .send(
      adminPage(
        req.user,
        req.session.display_name,
        req.session.role,
        req.session.icon
      )
    )
})

//register
router
  .route('/signup')
  .get(function (req, res) {
    if (config.auth.useLDAP) {
      return res.redirect(`${basePath}/login?e=NA`)
    } else if (req.query.e === 'existingUser') {
      return res.send(
        registerPage('The username already exists. Please choose another.')
      )
    } else {
      return res.send(registerPage(''))
    }
  })
  .post(function (req, res, next) {
    if (config.auth.useLDAP) {
      return res.redirect(`${basePath}/login`)
    } else {
      return LocalSignup(req, res, next)
    }
  })

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

router.get(
  '/deepdive/:study/:subject/:day',
  ensurePermission,
  function (req, res) {
    return res.send(
      deepdivePage(req.params.study, req.params.subject, req.params.day)
    )
  }
)

//Dashboard page
router.get(
  '/dashboard/:study/:subject',
  ensurePermission,
  async function (req, res) {
    try {
      const { appDb, dataDb } = req.app.locals
      const defaultConfig = await getConfigForUser({
        db: appDb,
        user: req.user,
        defaultConfig: defaultUserConfig,
      })
      const dashboardState = await getDashboardState({
        db: dataDb,
        study: req.params.study,
        subject: req.params.subject,
        defaultConfig,
      })
      return res.send(
        graphPage(
          req.params.subject,
          req.params.study,
          req.user,
          req.session.display_name,
          req.session.icon,
          req.session.mail,
          req.session.toc,
          dashboardState,
          defaultConfig,
          req.session.celery_tasks,
          req.session.role
        )
      )
    } catch (err) {
      console.error(err.message)
      return res.status(500).send({ message: err.message })
    }
  }
)

router
  .route('/resetpw')
  .get(function (req, res) {
    if (config.auth.useLDAP) {
      return res.redirect(`${basePath}/login?e=NA`)
    } else {
      let message = ''
      if (req.query.e) {
        if (req.query.e === 'unmatched') {
          message = 'The passwords do not match. Please try again.'
        } else if (req.query.e === 'db') {
          message = 'There was an error. Please contact the admin.'
        } else if (req.query.e === 'nouser') {
          message = 'The username or reset key did not match. Please try again.'
        } else {
          message = req.query.e
        }
      }
      return res.send(resetPage(message))
    }
  })
  .post(function (req, res) {
    if (req.body.password !== req.body.confirmpw) {
      return res.redirect(`${basePath}/resetpw?e=unmatched`)
    } else {
      const { appDb } = req.app.locals
      var hashedPW = hash(req.body.password)
      appDb.collection('users').findOneAndUpdate(
        { uid: req.body.username, reset_key: req.body.reset_key },
        {
          $set: { password: hashedPW, reset_key: '', force_reset_pw: false },
        },
        { returnOriginal: false },
        function (err, doc) {
          if (err) {
            console.log(err)
            return res.redirect(`${basePath}/resetpw?e=db`)
          } else if (!doc || doc['value'] === null) {
            return res.redirect(`${basePath}/resetpw?e=nouser`)
          } else {
            return res.redirect(`${basePath}/login?e=resetpw`)
          }
        }
      )
    }
  })

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

router.get('/dashboard/:study', ensurePermission, function (req, res) {
  const { appDb, dataDb } = req.app.locals

  co(function* () {
    // couple StudyConfig and UserConfig
    // var configs_heatmap = defaultStudyConfig['colormap'];
    const defaultStudyConfig = yield getConfigForUser({
      db: appDb,
      user: req.user,
      defaultConfig: defaultStudyConfig,
    })
    var configs_heatmap = defaultStudyConfig
    var metadocReference = yield dataDb.collection('metadata').findOne({
      study: req.params.study,
      role: 'metadata',
    })
    if (!metadocReference) {
      return res.status(500).send('Please contact the administrator.')
    }
    var metadoc = yield dataDb
      .collection(metadocReference['collection'])
      .find({})
      .toArray()
    var dashboardData = []
    for (const item in metadoc) {
      var dashboardState = {
        matrixData: [],
        project: metadoc[item]['Study'],
        subject: metadoc[item]['Subject ID'],
        consentDate: metadoc[item]['Consent'] || metadoc[item]['Consent Date'],
      }

      for (var configItem in configs_heatmap) {
        var assessment = configs_heatmap[configItem].analysis
        var collectionName =
          metadoc[item]['Study'] + metadoc[item]['Subject ID'] + assessment
        var encrypted = createHash('sha256')
          .update(collectionName)
          .digest('hex')

        var varName = configs_heatmap[configItem].variable
        var escapedVarName = encodeURIComponent(varName).replace(/\./g, '%2E')
        const query = [
          {
            $project: { _id: 0, day: 1, [escapedVarName]: `$${varName}` },
          },
        ]
        var data = yield dataDb
          .collection(encrypted.toString())
          .aggregate(query)
          .toArray()
        var dataPiece = {}
        dataPiece.text = configs_heatmap[configItem].text
        dataPiece.analysis = configs_heatmap[configItem].analysis
        dataPiece.category = configs_heatmap[configItem].category
        dataPiece.variable = configs_heatmap[configItem].variable
        dataPiece.label = configs_heatmap[configItem].label
        dataPiece.range = configs_heatmap[configItem].range
        dataPiece.color = configs_heatmap[configItem].color
        dataPiece.data =
          data.length >= 1 &&
          Object.prototype.hasOwnProperty.call(
            data[0],
            configs_heatmap[configItem].variable
          )
            ? data
            : []
        dataPiece.stat = []
        dashboardState.matrixData.push(dataPiece)
      }
      dashboardData.push(dashboardState)
    }
    return res.send(
      studyPage(
        req.params.study,
        req.user,
        req.session.display_name,
        req.session.icon,
        req.session.role,
        req.session.toc,
        req.session.celery_tasks,
        dashboardData,
        defaultStudyConfig
      )
    )
  })
})

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

router.get('/api/v1/users', ensureAdmin, function (req, res) {
  const { appDb } = req.app.locals
  appDb
    .collection('users')
    .find({}, { _id: 0, configs: 0, member_of: 0, password: 0, last_logoff: 0 })
    .toArray(function (err, users) {
      if (err) {
        console.log(err)
        return res.status(502).send([])
      } else if (users.length == 0) {
        return res.status(404).send([])
      } else {
        return res.status(200).json(users)
      }
    })
})
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

router.route('/reports').get(ensureAuthenticated, async (req, res) => {
  try {
    const { display_name, role, icon } = req.session

    return res.status(200).send(
      reportsListPage({
        uid: req.user,
        name: display_name,
        role,
        icon,
      })
    )
  } catch (err) {
    console.error(err.message)
    return res.status(500).send({ message: err.message })
  }
})

router.route('/reports/:id/view').get(ensureAuthenticated, async (req, res) => {
  try {
    const { display_name, role, icon } = req.session
    const user = {
      uid: req.user,
      name: display_name,
      role,
      icon,
    }
    const report = {
      id: req.params.id,
    }
    return res.status(200).send(viewReportPage({ user, report }))
  } catch (err) {
    console.error(err.message)
    return res.status(500).send({ message: err.message })
  }
})

router.route('/reports/:id/edit').get(ensureAuthenticated, async (req, res) => {
  try {
    const { display_name, role, icon } = req.session
    const user = {
      uid: req.user,
      name: display_name,
      role,
      icon,
    }
    const report = {
      mode: 'edit',
      id: req.params.id,
    }
    return res.status(200).send(editReportPage({ user, report }))
  } catch (err) {
    console.error(err.message)
    return res.status(500).send({ message: err.message })
  }
})

router.route('/reports/new').get(ensureAuthenticated, async (req, res) => {
  try {
    const { display_name, role, icon } = req.session
    const user = {
      uid: req.user,
      name: display_name,
      role,
      icon,
    }
    const report = {
      mode: 'create',
    }
    return res.status(200).send(editReportPage({ user, report }))
  } catch (err) {
    console.error(err.message)
    return res.status(500).send({ message: err.message })
  }
})

router
  .route('/api/v1/studies/:study/enrollment')
  .get(ensureAuthenticated, async (req, res) => {
    try {
      const { dataDb } = req.app.locals
      const metadoc = await dataDb.collection('metadata').findOne(
        {
          study: req.params.study,
          role: 'metadata',
        },
        { _id: 0, subjects: 1, collection: 1 }
      )
      const { subjects, collection } = metadoc
      if (!metadoc) {
        return res.status(404).send({ message: 'Study not found' })
      }
      let enrollment = 0
      if (!req.query.start && !req.query.end) {
        if (subjects && Array.isArray(subjects)) {
          enrollment = subjects.length
        }
      } else {
        const filteredByDate = await filterSubjectsByConsentDate({
          db: dataDb,
          collection,
          start: req.query.start,
          end: req.query.end,
        })
        enrollment = filteredByDate.length
      }
      return res.status(200).send({ enrollment })
    } catch (err) {
      console.error(err.message)
      return res.status(500).send({ message: err.message })
    }
  })
  .post(ensureAuthenticated, async (req, res) => {
    try {
      const { dataDb } = req.app.locals
      const { assessment, varName } = req.body
      if (!assessment || !varName) {
        return res.status(400).send({ message: 'Bad request' })
      }
      const metadoc = await dataDb.collection('metadata').findOne(
        {
          study: req.params.study,
          role: 'metadata',
        },
        { _id: 0, collection: 1 }
      )
      const { collection } = metadoc
      let allSubjects = []
      if (!req.query.start && !req.query.end) {
        allSubjects = await dataDb.collection(collection).find({}).toArray()
      } else {
        allSubjects = await filterSubjectsByConsentDate({
          db: dataDb,
          collection,
          start: req.query.start,
          end: req.query.end,
        })
      }
      const matchingSubjectIDs = allSubjects.map((entry) => ({
        id: entry['Subject ID'].toString(),
        consentDate: entry['Consent'] || entry['Consent Date'],
      }))
      let enrollmentsList = []
      await Promise.all(
        matchingSubjectIDs.map(async (subject) => {
          const assessmentCollection = await dataDb.collection('toc').findOne(
            {
              study: req.params.study,
              assessment,
              subject: subject.id,
            },
            { _id: 0, collection: 1 }
          )
          if (assessmentCollection !== null) {
            const foundData = await dataDb
              .collection(assessmentCollection.collection)
              .findOne(
                { [varName]: { $exists: true, $ne: '' } },
                { [varName]: 1 }
              )
            if (
              foundData !== null &&
              (foundData[varName] === 0 || foundData[varName])
            ) {
              const valueForVar = foundData[varName]
              enrollmentsList.push({
                study: req.params.study,
                date: subject.consentDate,
                varName,
                value: valueForVar,
              })
            } else {
              enrollmentsList.push({
                study: req.params.study,
                date: subject.consentDate,
                varName,
                value: null,
              })
            }
          }
          return Promise.resolve()
        })
      )
      return res.status(200).send({ enrollmentsList })
    } catch (err) {
      console.error(err.message)
      return res.status(500).send({ message: err.message })
    }
  })

router
  .route('/api/v1/reports')
  .get(ensureAuthenticated, async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { user } = req
      const reports = await appDb
        .collection('reports')
        .find(
          {
            $or: [{ user }, { readers: user }],
          },
          { charts: 0 }
        )
        .toArray()
      return res.status(200).send({ reports })
    } catch (err) {
      console.error(err.message)
      return res.status(500).send({ message: err.message })
    }
  })
  .post(ensureAuthenticated, async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { body, user } = req
      await appDb.collection('reports').insertOne({
        ...body,
        user,
        readers: [user],
        created: new Date().toUTCString(),
      })
      return res.status(200).send()
    } catch (err) {
      console.error(err.message)
      return res.status(500).send({ message: err.message })
    }
  })

router
  .route('/api/v1/reports/:id')
  .get(ensureAuthenticated, async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { user } = req
      const report = await appDb.collection('reports').findOne({
        _id: ObjectId(req.params.id),
        $or: [{ user }, { readers: user }],
      })
      if (report === null) {
        return res.status(404).send({ message: 'Report not found' })
      }
      return res.status(200).send({ report })
    } catch (err) {
      console.error(err.message)
      return res.status(500).send({ message: err.message })
    }
  })
  .patch(ensureAuthenticated, async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { body, user, params } = req
      await appDb.collection('reports').findOneAndUpdate(
        {
          _id: ObjectId(params.id),
          user,
        },
        {
          $set: {
            ...body,
          },
        }
      )
      return res.status(200).send()
    } catch (err) {
      console.error(err.message)
      return res.status(500).send({ message: err.message })
    }
  })
  .delete(ensureAuthenticated, async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { user } = req
      const deletionRes = await appDb.collection('reports').deleteOne({
        _id: ObjectId(req.params.id),
        user,
      })
      if (deletionRes.deletedCount > 0) {
        return res.status(200).send()
      } else {
        return res.status(404).send({ message: 'Report not found' })
      }
    } catch (err) {
      console.error(err.message)
      return res.status(500).send({ message: err.message })
    }
  })

/**
 * Study Details
 */
router.route('/study-details').get(ensureAuthenticated, async (req, res) => {
  try {
    const { display_name, role, icon } = req.session

    return res.status(200).send(
      studyDetailsPage({
        uid: req.user,
        name: display_name,
        role,
        icon,
      })
    )
  } catch (error) {
    console.error(error.message)

    return res.status(500).send({ message: err.message })
  }
})

router
  .route('/api/v1/study-details')
  .get(ensureAuthenticated, async (req, res) => {
    try {
      const { dataDb } = req.app.locals
      const data = await dataDb
        .collection(collections.studyDetails)
        .find({ owner: req.user })
        .toArray()

      return res.status(200).json({ data })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  })
  .post(ensureAuthenticated, async (req, res) => {
    const { study, owner, targetEnrollment } = req.body
    try {
      const { dataDb } = req.app.locals
      const data = await dataDb
        .collection(collections.studyDetails)
        .findOneAndUpdate(
          { study },
          {
            $set: {
              study,
              owner,
              targetEnrollment,
              updatedAt: new Date().toISOString(),
            },
          },
          {
            upsert: true,
          }
        )

      return res.status(200).json({ data })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  })

router
  .route('/api/v1/study-details/:detailId')
  .delete(ensureAuthenticated, async (req, res) => {
    const { detailId } = req.params
    try {
      const { dataDb } = req.app.locals
      const deleted = await dataDb
        .collection(collections.studyDetails)
        .deleteOne({ _id: ObjectId(detailId) })

      if (deleted.deletedCount > 0) {
        return res.status(200).json({ data: deleted.deletedCount })
      } else {
        return res.status(404).json({ message: 'Study Details Not Found' })
      }
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  })

export default router
