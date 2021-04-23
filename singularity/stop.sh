#!/bin/bash

# strict mode so script quits immediately upon failure
set -eo pipefail

# Getting environment variables from .env
source ./loadenv.sh
source ./varcheck.sh

singularity run -B ${DPDASH_STATE_DIR}:/data -B ${DPDASH_DATA_DIR}:/project_data ${DPDASH_IMG} /sw/apps/dpdash/singularity/quit.sh