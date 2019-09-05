Tips and tricks
===============
The following tips and tricks will help you troubleshoot and hack on 
DPdash.

Binding the source code
-----------------------
The ``dpdash.sif`` is a read-only Singularity image file. During the build 
process, DPdash is written to a directory within the directory ::
 
    /sw/apps/dpdash

If you feel the need to modify the DPdash code, you either have to build the 
container in ``sandbox`` mode, or use ``-B|--bind`` to bind a local directory 
containing the DPdash application source into the container ::

    singularity instance start \
        -B ${state}:/data \
        -B ${data}:${data} \
        -B /path/to/dpdash/src:/sw/apps/dpdash \
        dpdash.sif
        dpdash

