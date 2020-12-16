#!/bin/bash

# strict mode so script quits immediately upon failure
set -eo pipefail

# stop npm
cd /sw/apps/dpdash
npm stop

# todo: make this do a graceful exit

# The commented line below is not working on Linux 7
# ps auxww | grep 'pm2' | awk '{print $2}' | xargs kill -9
pkill -f 'pm2'

#todo: send SIGQUIT to supervisord 

# The commented line below is not working on Linux 7
# ps auxww | grep 'supervisord' | awk '{print $2}' | xargs kill -15
pkill -f 'supervisord'
pkill -f 'rabbitmq'
pkill -f 'erlang'
pkill -f 'celery'
pkill -f 'mongo'
