#!/usr/b n/env python

import argparse as ap
import os
import logging

logger = logging.getLogger(os.path.basename(__file__))
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def main():
    parser = ap.ArgumentParser('DPdash Configuration')

    parser.add_argument('--data-dir', help='Path to the root directory for GENERAL and PROTECTED folders')
    parser.add_argument('--config-dir', help='Path to the directory for all configuration files')
    parser.add_argument('--mongo-pw', help='MongoDB password for username dpdash')
    parser.add_argument('--rabbit-username', help='RabbitMQ username')
    parser.add_argument('--rabbit-pw', help='RabbitMQ password')
    parser.add_argument('--ssl-ca', help='Path to the ssl CA in PEM')
    parser.add_argument('--ssl-client-cert', help='Path to the client ssl certificate')
    parser.add_argument('--ssl-client-key', help='Path to the client ssl key')
    parser.add_argument('--ssl-server-cert', help='Path to the server ssl certificate')
    parser.add_argument('--ssl-server-key', help='Path to the server ssl key')
    parser.add_argument('--mongo-server-cert', help='Path to the MongoDB certificate')
    parser.add_argument('--mongo-path', help='Path to the MongoDB bind path')
    parser.add_argument('--celery-path', help='Path to the Celery bind path')
    parser.add_argument('--dpdash-path', help='Path to the DPdash bind path')

    parser.add_argument('--rabbit-host', help='Rabbitmq host address')
    parser.add_argument('--mongo-host', help='MongoDB host address')
    parser.add_argument('--rabbit-port', help='Rabbitmq port number', default=5971)
    parser.add_argument('--mongo-port', help='MongoDB port number', default=27018)
    parser.add_argument('--dpdash-port', help='DPdash port number', default=8001)

    parser.add_argument('--dpdash-secret', help='DPdash session secret')
    parser.add_argument('--app-secret', help='App secret')

    args = parser.parse_args()

    configure_rabbit(args.rabbit_port, args.ssl_ca, args.ssl_server_cert, args.ssl_server_key, args.config_dir)
    configure_mongo(args.mongo_port, args.mongo_path, args.ssl_ca, args.mongo_server_cert, args.config_dir)
    configure_dppy(args.rabbit_port, args.celery_path, args.ssl_client_key, args.ssl_client_cert, args.ssl_ca, args.config_dir, args.rabbit_pw, args.rabbit_host)
    configure_dpdash(args.ssl_ca, args.ssl_client_key, args.ssl_client_cert, args.dpdash_port, args.mongo_port, args.rabbit_port, args.mongo_pw, args.rabbit_pw, args.dpdash_secret, args.config_dir, args.data_dir, args.dpdash_path, args.rabbit_host, args.mongo_host, args.app_secret)

def export_file(file_path, content):
    try:
        with open(file_path, 'w') as writeable:
            logger.info('Writing {FILE}'.format(FILE=file_path))
            writeable.write(content)
    except Exception as e:
        logger.error(e)

    return

def configure_rabbit(rabbit_port, ca_path, cert_path, key_path, config_path):
    configuration = '''[
  {ssl, [{versions, ['tlsv1.2', 'tlsv1.1']}]},
  {kernel, [
    {inet_dist_listen_min, 33672},
    {inet_dist_listen_max, 33672}
  ]},
  {rabbit2, [
    {ssl_listeners, [%(rabbit_port)s]},
    {ssl_options, [{cacertfile, "%(ca_path)s"},
                   {certfile, "%(cert_path)s"},
                   {keyfile, "%(key_path)s"},
                   {versions, ['tlsv1.2','tlsv1.1']},
                   {verify, verify_peer},
                   {fail_if_no_peer_cert, true}]}
   ]}
].''' % { 'rabbit_port' : rabbit_port, 'ca_path' : ca_path, 'cert_path' : cert_path, 'key_path' : key_path }

    return export_file(os.path.join(config_path,'rabbitmq.config'), configuration)

def configure_mongo(mongo_port, mongo_path, ca_path, mongocert_path, config_path):
    configuration = '''auth = true
fork = false
port = %(mongo_port)s
dbpath = %(mongo_path)s/dbs/
logappend = true
logpath = %(mongo_path)s/logs/mongodb.log
sslMode = requireSSL
sslPEMKeyFile = %(mongocert_path)s
sslCAFile = %(ca_path)s''' % { 'mongo_port' : mongo_port, 'mongo_path' : mongo_path, 'mongocert_path' : mongocert_path, 'ca_path' : ca_path }

    return export_file(os.path.join(config_path, 'mongodb.conf'), configuration)

def configure_dppy(rabbit_port, celery_path, key_path, cert_path, ca_path, config_path, rabbit_pw, rabbit_host):
    configuration = '''{
    "celery" : {
        "queue" : "dpdash",
        "broker" : "amqp://dpdash:%(rabbit_pw)s@%(rabbit_host)s:%(rabbit_port)s//",
        "backend" : "amqp://dpdash:%(rabbit_pw)s@%(rabbit_host)s:%(rabbit_port)s//",
        "CELERY_RESULT_BACKEND" : "rpc",
        "CELERY_RESULT_PERSISTENT" : true,
        "CELERY_TASK_SERIALIZER" : "json",
        "CELERY_RESULT_SERIALIZER" : "json",
        "CELERY_IGNORE_RESULT" : false,
        "CELERY_ACCEPT_CONTENT" : ["json"],
        "CELERYD_STATE_DB" : "%(celery_path)s",
        "BROKER_USE_SSL" : {
            "keyfile": "%(key_path)s",
            "certfile" : "%(cert_path)s",
            "ca_certs" : "%(ca_path)s"
        },
        "BROKER_TRANSPORT_OPTIONS" : {
            "confirm_publish" : true
        }
    },
    "mongodb" : {
        "ssl" : {
            "ssl_certfile" : "%(cert_path)s",
            "ssl_keyfile" : "%(key_path)s",
            "ca_certs" : "%(ca_path)s"
        }
    }
}''' % {
        'rabbit_host' : rabbit_host,
        'rabbit_port' : rabbit_port,
        'celery_path' : celery_path,
        'key_path': key_path,
        'cert_path' : cert_path,
        'ca_path' : ca_path,
        'rabbit_pw':rabbit_pw
    }

    return export_file(os.path.join(config_path, 'dppy.conf'), configuration)

def configure_dpdash(ca_path, key_path, cert_path, dpdash_port, mongo_port, rabbit_port, mongo_password, rabbit_password, session_secret, config_path, data_repo, dpdash_path, rabbit_host, mongo_host, secret):
    configuration = '''var fs = require("fs");
var cert = fs.readFileSync("%(cert_path)s");
var key = fs.readFileSync("%(key_path)s");
var ca = [fs.readFileSync("%(ca_path)s")];

var config = {};

config.app = {};
config.app.debug = false;
config.app.address = "0.0.0.0";
config.app.port = %(dpdash_port)s;
config.app.logfile = "%(dpdash_log)s";
config.app.archive = "data";
config.app.secret = "%(secret)s";
config.app.sslKey = "%(key_path)s";
config.app.sslCertificate = "%(cert_path)s";
config.app.realms = [ "" ];
config.app.rootDir = "%(data_repo)s";

config.database = {};
config.database.mongo = {};
config.database.mongo.host = "%(mongo_host)s";
config.database.mongo.port = %(mongo_port)s;
config.database.mongo.appDB = "dpdmongo";
config.database.mongo.dataDB = "dpdata";
config.database.mongo.authSource = "admin";
config.database.mongo.username = "dpdash";
config.database.mongo.password = "%(mongo_password)s";

config.database.mongo.server = {};
config.database.mongo.server.ssl = true;
config.database.mongo.server.sslCA = ca;
config.database.mongo.server.sslCert = cert;
config.database.mongo.server.sslKey = key;
config.database.mongo.server.sslValidate = false;
config.database.mongo.server.reconnectTries = 1;
config.database.mongo.server.useNewUrlParser = true;

config.database.acl = {};
config.database.acl.json = "%(acl_path)s";

config.rabbitmq = {};

config.rabbitmq.host = "%(rabbit_host)s";
config.rabbitmq.port = "%(rabbit_port)s";
config.rabbitmq.vhost = "/";
config.rabbitmq.username = "dpdash";
config.rabbitmq.password = "%(rabbit_password)s";
config.rabbitmq.publisherQueue = "dpdash";
config.rabbitmq.consumerQueue = "dpdashResponse";

config.rabbitmq.opts = {};
config.rabbitmq.opts.ca = ca;
config.rabbitmq.opts.cert = cert;
config.rabbitmq.opts.key = key;

config.rabbitmq.sync = {};
config.rabbitmq.sync.hours = [1];

config.session = {};

config.session.secret = "%(session_secret)s";
config.session.saveUninitialized = false;
config.session.resave = true;

config.session.cookie = {};
config.session.cookie.secure = true;
config.session.cookie.maxAge = 24*60*60*1000;

config.auth = {};
config.auth.table = "users";
config.auth.usernameField = "username";
config.auth.passwordField = "password";
config.auth.useLDAP = false;

config.auth.ldap = {};
config.auth.ldap.url = "ldap://0.0.0.0:000";
config.auth.ldap.bindDn = "cn=,ou=,dc=";
config.auth.ldap.bindCredentials = "PASSWORD";
config.auth.ldap.searchBase = "ou=,dc=,dc=";
config.auth.ldap.searchFilter = "(uid={{username}})";
config.auth.ldap.searchAttributes = ["cn", "mail", "memberOf", "uid", "title", "department", "company", "telephoneNumber", "badPwdCount", "badPasswordTime", "lockoutTime", "whenCreated", "whenChanged", "lastLogoff", "lastLogon", "accountExpires"];

module.exports = config;''' % {
        'secret' : secret,
        'rabbit_host': rabbit_host,
        'mongo_host': mongo_host,
        'rabbit_port' : rabbit_port,
        'mongo_port' : mongo_port,
        'dpdash_port' : dpdash_port,
        'key_path' : key_path,
        'cert_path' : cert_path,
        'ca_path' : ca_path,
        'mongo_password' : mongo_password,
        'rabbit_password' : rabbit_password,
        'session_secret' : session_secret,
        'data_repo' : data_repo,
        'acl_path': os.path.join(dpdash_path, 'acl.json'),
        'dpdash_log': os.path.join(dpdash_path, 'dpdash.log')
    }

    return export_file(os.path.join(config_path, 'dpdash.js'), configuration)

if __name__ == '__main__':
    main()
