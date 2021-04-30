const configPath = process.env.DPDASH_CONFIG || './config';
const config = require(configPath);

const getMongoURI = ({ settings }) => {
  let mongoURI = 'mongodb://' + settings.username + ':';
  mongoURI = mongoURI + settings.password + '@' + settings.host;
  mongoURI = mongoURI + ':' + settings.port + '/' + settings.appDB;
  mongoURI = mongoURI + '?authSource=' + settings.authSource;

  return mongoURI;
}

exports.getMongoURI = getMongoURI;
