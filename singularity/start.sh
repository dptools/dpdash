#!/bin/bash

# strict mode so script quits immediately upon failure
set -eo pipefail

shellmode=false

while getopts ":s" opt; do
    case $opt in
        s)
            shellmode=true
            echo "Starting Singularity shell..."
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
    singularity shell -B ${state}:/data -B ${data}:/project_data ${DPDASH_IMG}
else
    singularity run -B ${state}:/data -B ${data}:/project_data ${DPDASH_IMG} /sw/apps/dpdash/singularity/run.sh
fi