#!/bin/bash

# strict mode so script quits immediately upon failure
set -eo pipefail

mongopw=$1
rabbitpw=$2
appsecret=$3

# Generate dpdash password
nodecmd='require("/sw/apps/dpdash/utils/crypto/hash.js")("dpdash","aes-256-ctr","encrypt","'$appsecret'")'
adminpw=`node -p $nodecmd`

## Set up MongoDB Authentication & SSL
echo '***************Setting up MONGOB***************'
mongod --port 27018 --logpath /data/dpdash/mongodb/logs/mongod.log --dbpath /data/dpdash/mongodb/dbs --fork
mongo admin --port 27018 --eval "db.createUser({user: 'dpdash', pwd:'"$mongopw"', roles: [ { role: 'root', db: 'admin' } ] });"
mongo dpdmongo --port 27018 --eval "db.users.insertOne({uid : 'dpdash', password:'"$adminpw"', role: 'admin', ldap: false, display_name: 'dpdash'});"
mongod --shutdown --dbpath /data/dpdash/mongodb/dbs

## Set up Rabbitmq Server
echo '***************Setting up RABBITMQ***************'
export RABBITMQ_CONFIG_FILE=/data/dpdash/configs/rabbitmq.conf
export RABBITMQ_CONF_ENV_FILE=/data/dpdash/configs/rabbitmq-env.conf
/usr/lib/rabbitmq/bin/rabbitmq-server start -detached
sleep 10 && /usr/lib/rabbitmq/bin/rabbitmqctl add_user dpdash $rabbitpw
sleep 10 && /usr/lib/rabbitmq/bin/rabbitmqctl set_permissions -p / dpdash ".*" ".*" ".*"
sleep 10 && /usr/lib/rabbitmq/bin/rabbitmqctl delete_user guest
sleep 10 && /usr/lib/rabbitmq/bin/rabbitmqctl stop

## Set up Celery Server
echo '***************Setting up CELERY***************'
export dppy_config=/data/dpdash/configs/dppy.conf

echo '****************Set Up Complete****************'
