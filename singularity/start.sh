#!/bin/bash

# strict mode so script quits immediately upon failure
set -eo pipefail

shellmode=false
devmode=false

while getopts ":sd" opt; do
    case $opt in
        s)
            shellmode=true
            echo "Starting Singularity shell..."
            ;;
        d)
            devmode=true
            echo "Mounting dev directory..."
            ;;
        \?)
            echo "Invalid option: -$OPTARG"
            ;;
    esac
done

# Getting environment variables from .env
source ./loadenv.sh
source ./varcheck.sh

if [ $shellmode = true ]
then
    if [ $devmode = true ]
    then
        if [ -z ${DPDASH_DEV_DIR} ] || [ ! -d "$DPDASH_DEV_DIR" ]
        then 
            echo "DPDASH_DEV_DIR is unset in .env or is not a directory"
            exit 1
        else
            singularity shell \
            -B ${state}:/data \
            -B ${data}:/project_data \
            -B ${DPDASH_DEV_DIR}:/sw/apps/dpdash \
            -B ${state}/dpdash/configs/dashboard:/sw/apps/dpdash/server/configs \
            -B ${state}/dpdash/dist:/sw/apps/dpdash/dist \
            ${DPDASH_IMG}
        fi
    else
        singularity shell \
        -B ${state}:/data \
        -B ${data}:/project_data \
        -B ${state}/dpdash/configs/dashboard:/sw/apps/dpdash/server/configs \
        -B ${state}/dpdash/dist:/sw/apps/dpdash/dist \
        ${DPDASH_IMG}
    fi
else
    singularity run \
    -B ${state}:/data \
    -B ${data}:/project_data \
    -B ${state}/dpdash/configs/dashboard:/sw/apps/dpdash/server/configs \
    -B ${state}/dpdash/dist:/sw/apps/dpdash/dist \
    ${DPDASH_IMG} \
    /sw/apps/dpdash/singularity/run.sh
fi