#!/bin/bash

# strict mode so script quits immediately upon failure
set -eo pipefail

# Proxy settings
export http_proxy=${httpProxy}
export https_proxy=${httpsProxy}
export noProxy=${noProxy}

# vars for rabbitmq-server
export RABBITMQ_CONFIG_FILE=/data/dpdash/configs/rabbitmq
export RABBITMQ_MNESIA_BASE=/data/dpdash/rabbitmq
export RABBITMQ_LOG_BASE=/data/dpdash/rabbitmq

# vars for celery worker
export dppy_config=/data/dpdash/configs/dppy.conf

cd /sw/apps/dpdash

node ./dist/utils/importer.js
