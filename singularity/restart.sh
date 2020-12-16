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

# miniconda2 settings
export PATH=/sw/apps/miniconda/bin:$PATH

# vars for rabbitmq-server
export RABBITMQ_CONFIG_FILE=/data/dpdash/configs/rabbitmq
export RABBITMQ_MNESIA_BASE=/data/dpdash/rabbitmq
export RABBITMQ_LOG_BASE=/data/dpdash/rabbitmq

# vars for celery worker
export dppy_config=/data/dpdash/configs/dppy.conf

# start mongodb, celery, and rabbit
/sw/apps/miniconda/bin/supervisord -c /data/dpdash/configs/supervisord.conf

# sleep 100 seconds
sleep 100

# vars for DPdash node app
export DPDASH_CONFIG=/data/dpdash/configs/dpdash.js
export DPDASH_UPLOADS=/data/dpdash/uploads
export DPDASH_UPLOADS_CONFIG_SCHEMA=/data/dpdash/configs/dashboard/config.schema
export DPDASH_DASHBOARD_CONFIG_DEFAULT=/data/dpdash/configs/dashboard/defaultUserConfig.js
export DPDASH_DASHBOARD_CONFIG_DEFAULT_STUDY=/data/dpdash/configs/dashboard/defaultStudyConfig.js
cd /sw/apps/dpdash
npm restart
