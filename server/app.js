import express from 'express'
import path from 'path'
import morgan from 'morgan'
import winston from 'winston'
import favicon from 'serve-favicon'
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'
import MongoStore from 'connect-mongo'
import { MongoClient } from 'mongodb'
import passport from 'passport'
import { Strategy } from 'passport-local'
import bodyParser from 'body-parser'
import livereload from 'livereload'
import connectLiveReload from 'connect-livereload'
import helmet from 'helmet'

import assessmentData from './routes/assessmentData'
import adminRouter from './routes/admin'
import authRouter from './routes/auth'
import chartsRouter from './routes/charts'
import configurationsRouter from './routes/configurations'
import dashboardsRouter from './routes/dashboards'
import indexRouter from './routes/index'
import participantsRouter from './routes/participants'
import siteMetadata from './routes/siteMetadata'
import usersRouter from './routes/users'
import { PASSPORT_FIELDS_ATTRIBUTES } from './constants'
import UserModel from './models/UserModel'
import { verifyHash } from './utils/crypto/hash'

const localStrategy = Strategy
const isProduction = process.env.NODE_ENV === 'production'
const cookieAttributes = {
  secure: isProduction,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: 'strict',
}
const app = express()

if (process.env.NODE_ENV === 'development') {
  const liveReloadServer = livereload.createServer()
  liveReloadServer.watch(path.join(__dirname, '..', 'public', 'js'))
  liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
      liveReloadServer.refresh('/*')
    }, 100)
  })
  app.use(connectLiveReload())
}
/** favicon setup */
app.use(favicon(path.join(__dirname, '../public/img/favicon.ico')))

app.use(helmet({ noSniff: true, contentSecurityPolicy: isProduction }))

/** logger setup */
morgan.token('remote-user', function (req, res) {
  return req.user ? req.user.uid : 'unidentified'
})
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    }),
  ],
  exitOnError: false,
})
logger.stream = {
  write: function (message, encoding) {
    logger.info(message)
  },
}
app.use(morgan('tiny', { stream: logger.stream }))

/** parsers setup */
app.use(express.static('public'))
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(bodyParser.json({ limit: '500mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

/* database setup */
const mongoURI =
  process.env.MONGODB_URI ||
  `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:27017/`

const client = new MongoClient(mongoURI, { monitorCommands: true })

app.locals.appDb = client.db()

client.on('connectionCreated', async () => {
  await UserModel.createFirstAdmin(app.locals.appDb)
})
/** session store setup */
app.set('trust proxy', 1)
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    proxy: true,
    cookie: cookieAttributes,
    store: MongoStore.create({
      mongoUrl: mongoURI,
    }),
  })
)
app.use(passport.initialize())
app.use(passport.session())
//passport local strategy
passport.use(
  new localStrategy(
    {
      ...PASSPORT_FIELDS_ATTRIBUTES,
    },
    async (username, password, done) => {
      const { appDb } = app.locals
      const userAttributes = { uid: username }

      const user = await UserModel.findOne(appDb, userAttributes, {
        password: 1,
        role: 1,
        display_name: 1,
        mail: 1,
        icon: 1,
        access: 1,
        account_expires: 1,
        uid: 1,
      })
      if (!user) return done(null, false)

      if (!verifyHash(password, user?.password)) return done(null, false)

      delete user.password

      return done(null, user)
    }
  )
)

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(async function (user, done) {
  done(null, user)
})

app.use('/', assessmentData)
app.use('/', adminRouter)
app.use('/', authRouter)
app.use('/', chartsRouter)
app.use('/', configurationsRouter)
app.use('/', dashboardsRouter)
app.use('/', indexRouter)
app.use('/', participantsRouter)
app.use('/', siteMetadata)
app.use('/', usersRouter)
app.use('./img', express.static(path.join(__dirname, '../public/img')))

app.get('/*', async (req, res) => {
  return res.sendFile(
    path.join(__dirname, '..', 'public', 'index.html'),
    (err) => {
      if (err) {
        res.status(500).send(err)
      }
    }
  )
})

//catch any other error
app.use(function (err, req, res, next) {
  if (err) {
    console.error(err)
    return res.status(err.status).json({ error: err.message })
  }
})

export default app
