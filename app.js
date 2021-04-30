var createError = require('http-errors');
var express = require('express');
var path = require('path');
var helmet = require('helmet');
var morgan = require('morgan');
var winston = require('winston');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo');
var MongoDB = require('mongodb');
var MongoClient = MongoDB.MongoClient;
var passport = require('passport');
var ldapStrategy = require('passport-ldapauth');
var passportLocal = require('passport-local');
var localStrategy = passportLocal.Strategy;
var co = require('co');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
const noCache = require('nocache');
const { getMongoURI } = require('./utils/mongoUtil');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var configPath = process.env.DPDASH_CONFIG || './config';
var config = require(configPath);

var app = express();

/** favicon setup */
app.use(favicon(path.join(__dirname, '/public/img/favicon.png')));

/** security setup */
app.use(helmet({
  noSniff: true
}));

app.use(noCache());

/** logger setup */
morgan.token('remote-user', function (req, res) {
  return (req.user) ? req.user : 'unidentified';
});
var logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level: 'verbose',
      filename: config.app.logfile,
      handleExceptions: true,
      json: true,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});
logger.stream = {
  write: function (message, encoding) {
    logger.info(message)
  }
};
app.use(morgan('combined', { 'stream': logger.stream }));

/** parsers setup */
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(config.session.secret));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.set('view engine', 'html');
app.use(methodOverride());


/* database setup */
let mongodb;
const mongoURI = getMongoURI({ settings: config.database.mongo });
const mongodbPromise = co(function* () {
  return yield MongoClient.connect(mongoURI, config.database.mongo.server);
}).then(function (res) {
  mongodb = res.db();
  mongodb.collection('sessions').drop();
  return res;
});

/** session store setup */
app.set('trust proxy', 1);
app.use(expressSession({
  secret: config.session.secret,
  saveUninitialized: config.session.saveUninitialized,
  resave: config.session.resave,
  cookie: config.session.cookie,
  store: MongoStore.create({
    clientPromise: mongodbPromise,
    autoRemove: 'native'
  })
}));

/** authenticator setup */
if (config.auth.useLDAP) {
  //passport ldap strategy
  passport.use(new ldapStrategy({
    server: config.auth.ldap,
    usernameField: config.auth.usernameField,
    passwordField: config.auth.passwordField
  }));
}

//passport local strategy
passport.use('local-login', new localStrategy({
  usernameField: config.auth.usernameField,
  passwordField: config.auth.passwordField
},
  function (username, password, done) {
    mongodb.collection('users').findOne({ uid: username }).then(function (user) {
      if (!user) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    });
  }
));

//passport local registeration
passport.use('local-signup', new localStrategy({
  usernameField: config.auth.usernameField,
  passwordField: config.auth.passwordField,
  passReqToCallback: true
},
  function (req, username, password, done) {
    mongodb.collection('users').findOne({ uid: username }).then(function (err, user) {
      if (!user) {
        return done(null, false, req.body);
      }
      return done(null, true, null);
    });
  }
));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/css', express.static(path.join(__dirname, '/public/css')));
app.use('/js', express.static(path.join(__dirname, '/public/js')));
app.use('/img', express.static(path.join(__dirname, '/public/img')));
//app.use('/users', usersRouter);

/** error handlers setup */

//catch 404 and forward to error handler
app.use(function (req, res, next) {
  if (req.accepts('html')) {
    res.status(404);
    return;
  }

  if (req.accepts('json')) {
    res.status(404).json({ error: '404: Page not found.' });
    return;
  }

  res.status(404).type('txt').send('ERROR 404: Page not found.');

  next(err);
});

//catch any other error
app.use(function (err, req, res, next) {
  console.log(err);
  var errStatus = err.status || 500;
  var errMessage = '';
  switch (errStatus) {
    case 400:
      errMessage = 'Bad Request';
      break;
    case 401:
      errMessage = 'Unauthorized';
      break;
    case 403:
      errMessage = 'Forbidden';
      break;
    case 500:
      errMessage = 'Internal Server Error';
      break;
  } /*
    res.status(errStatus).json({
        status: 'error',
        message: errMessage
    }); */
});


module.exports = app;
