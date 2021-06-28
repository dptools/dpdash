#!/bin/bash

# strict mode so script quits immediately upon failure
set -eo pipefail

# stop npm
cd /sw/apps/dpdash
npm stop

# kill PM2
./node_modules/pm2/bin/pm2 kill

# kill supervisord (thus mongo, celery, erlang, rabbitmq)
echo "Quitting supervisord..."
pidfile="/data/dpdash/supervisord/supervisord.pid"
pid=$(<$pidfile)
kill -SIGQUIT $pid

while kill -s 0 $pid ; do : ; sleep 0.25 ; done
green='\033[0;32m'
NC='\033[0m'
echo -e "${green}Quit complete.${NC}"