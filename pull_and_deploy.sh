#!/bin/bash

cd /sw/apps/dpdash/
git checkout -- package-lock.json
git pull origin pnl-devel
singularity/quit.sh
npm install && \
npm run build && \
singularity/run.sh
