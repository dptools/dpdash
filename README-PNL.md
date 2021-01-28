![](https://github.com/pnlbwh/pnlpipe/blob/py3-compatible/Misc/pnl-bwh-hms.png)

This documentation has been developed through first hand experiment of independent DPdash instantiation. 
It can be primarily followed for running DPdash. Some other details including PHOENIX style 
can be found at http://docs.neuroinfo.org/dpdash/en/latest/


Table of Contents
=================

  * [Get image](#get-image)
     * [Download](#download)
     * [Build](#build)
  * [Use image](#use-image)
     * [Define](#define)
     * [Initialize](#initialize)
     * [Import](#import)
     * [Run](#run)
     * [Quit](#quit)
     * [Restart](#restart)
  * [Troubleshoot](#troubleshoot)
     * [Logs](#logs)
     * [Cookies](#cookies)
     * [Database](#database)

Table of Contents created by [gh-md-toc](https://github.com/ekalinin/github-markdown-toc)


## Get image

### Download

    https://www.dropbox.com/s/place/holder



### Build

Advanced users are advised to build the image in their own machine:

    git clone https://github.com/PREDICT-DPACC/dpdash.git
    cd dpdash/singularity
    singularity build dpdash.sif Singularity


## Use image

Once you have the image, follow the next steps to initialize database, import local data 
into the database, instantiate DPdash, and run it.

### Define

Define two variables `state` and `data` that can be used respectively for DPdash application data 
and project data:

    export state=/where/you/want/to/save/app/data
    export data=/where/you/have/PHOENIX/format/project/data


### Initialize
    
    export DPDASH_IMG=/path/to/dpdash.sif
    cd dpdash/singularity
    ./init.sh ${data} ${state}


### Import

After initializing a DPdash instance, data need to be imported inside a mongo database. This step happens outside 
the Singularity container and requires https://github.com/PREDICT-DPACC/dpimport. Follow the steps there to install and use it.

`dpimport`: `import.py` requires a [config.yml](https://github.com/PREDICT-DPACC/dpimport/commit/378f99a13a215581f91a9c7feeecefb59a506d1d). 
You can edit the example with proper values of:

    ssl_keyfile:
    ssl_certfile:
    ssl_ca_certs:
    username:
    password:
    port: 27017
    auth_source: admin
    db: dpdata
    hostname:


After initialization, proper values of the above keys can be found in `${state}/dpdash/configs/dpdash.js`.
    

### Run


Launch a DPdash instance as follows:
    
    export DPDASH_IMG=/path/to/dpdash.sif
    singularity run -B ${state}:/data -B ${data}:/project_data /path/to/dpdash.sif /sw/apps/dpdash/run.sh
    
Alternatively, you can shell into the container and then execute further commands. In fact, this would be 
the recommended method for working with the image.
    
    export DPDASH_IMG=/path/to/dpdash.sif
    singularity shell -B ${state}:/data -B ${data}:/project_data /path/to/dpdash.sif
    
    Singularity> cd /sw/apps/dpdash/
    Singularity> ./run.sh

At these point, you can even exit from the Singularity shell and yet your DPdash instance would be running.


### View

Firstly, make sure the following prints the login page:

    curl -L http://0.0.0.0:8000

Then, try to view the login page in a web browser. Finally, enter the admin credentials and see if that works. 
If they do not, see the [Cookies](#cookies) section.


### Quit

    singularity run -B ${state}:/data -B ${data}:/project_data /path/to/dpdash.sif /sw/apps/dpdash/quit.sh

    
### Restart

Advanced users can save a good amount of time restarting the DPdash instance rather than doing a run-quit-run cycle. 
To be able to do that, define the [DPdash variables](https://github.com/PREDICT-DPACC/dpdash/blob/dcdc3ca702df688a2cc73376c2929415e0fd6c0b/singularity/run.sh#L30) in the Singularity shell:

    singularity shell -B ${state}:/data -B ${data}:/project_data /path/to/dpdash.sif
    
    Singularity> cd /sw/apps/dpdash/
    Singularity> # define the DPdash variables
    Singularity> npm restart

Similarly, you can do `npm start` or `npm stop`.


## Reverse proxy

    

## Troubleshoot

### Logs

* DPdash app
    
        Singularity> cd /sw/apps/dpdash
        Singularity> ./node_modules/pm2/bin/pm2 logs www


* mongodb

        Singularity> tail -f /data/dpdash/mongodb/logs/mongod.log



### Cookies

After entering admin credentials in DPdash login page, if you are dropped back to login again, 
set the following to `false`:

    ${state}/dpdash/configs/dpdash.js: config.session.cookie.secure = false;

and then [restart](#restart) the DPdash application.


### Database

After `init.sh` and `import.py`, you can verify if your data went inside mongo database:

    singularity shell -B ${state}:/data -B ${data}:/project_data /path/to/dpdash.sif
    
    Singularity> mongo --ssl --host `hostname` --sslCAFile /data/ssl/ca/cacert.pem --sslPEMKeyFile /data/ssl/mongo_client.pem


Inside mongo shell:

    > use admin
    > db.auth("username", "password")   // located in ${state}/dpdash/configs/dpdash.js
    > show dbs
    > use dpdata                        // the db name specified in config.yml for import.py
    > show collections
    > db.collection_name.findOne()      // one collection_name from the collections


