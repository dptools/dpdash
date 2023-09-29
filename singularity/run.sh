#!/bin/bash

# strict mode so script quits immediately upon failure
set -eo pipefail

httpProxy=$1
httpsProxy=$2
noProxy=$3

# Proxy settings
export http_proxy=${httpProxy}
export https_proxy=${httpsProxy}
export noProxy=${noProxy}


# vars for rabbitmq-server
export RABBITMQ_CONFIG_FILE=/data/dpdash/configs/rabbitmq.conf
export RABBITMQ_CONF_ENV_FILE=/data/dpdash/configs/rabbitmq-env.conf

# vars for celery worker
export dppy_config=/data/dpdash/configs/dppy.conf

# clear previous logs
rm -f ~/.pm2/logs/*
rm -f `find /data/dpdash/ -type f -name "*log"`
rm -f /data/dpdash/mongodb/dbs/diagnostic.data/*
rm -f /data/dpdash/supervisord/logs/*

# start mongodb, celery, and rabbit
echo "Starting superivsord..."
supervisord -c /data/dpdash/configs/supervisord.conf

# mongod is the one that takes most time to start and causes
# https://github.com/AMP-SCZ/dpdash/issues/407
# so let's wait for mongod to start
while [ -z `pgrep -f mongod` ]; do sleep 30; done
# sleep more for safeguard
sleep 100

cd /sw/apps/dpdash

echo "Starting dpdash..."
npm run transpile && npm start
