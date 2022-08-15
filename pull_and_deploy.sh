#!/bin/bash

cd /sw/apps/dpdash/
git checkout -- package-lock.json
git pull origin pnl-devel
singularity/quit.sh
rm /tmp/.build.log*
npm install && \
npm run build && \
singularity/run.sh
