![](https://github.com/pnlbwh/pnlpipe/blob/py3-compatible/Misc/pnl-bwh-hms.png)

This documentation has been developed through first hand experiment of independent DPdash instantiation. 
It can be primarily followed for running DPdash. Some other details including PHOENIX style directory tree 
can be found at http://docs.neuroinfo.org/dpdash/en/latest/ .


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
  * [Reverse proxy](#reverse-proxy)
  * [Troubleshooting](#troubleshooting)
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


`${state}` is an empty directory that will be populated with files once you do `./init.sh` but you need to have 
[PHOENIX style directory trees](http://docs.neuroinfo.org/dpdash/en/latest/quick_start.html#create-data-persistence-directories) inside `${data}`.

### Initialize
    
    export DPDASH_IMG=/path/to/dpdash.sif
    cd dpdash/singularity
    ./init.sh ${data} ${state}

Then, do the following modification to circumvent a cookie issue that might occur later:

    ${state}/dpdash/configs/dpdash.js: config.session.cookie.secure = false;

You can read the [Cookies](#cookies) section for details.
    

### Run

Launch a DPdash instance as follows:
    
    export DPDASH_IMG=/path/to/dpdash.sif
    singularity run -B ${state}:/data -B ${data}:/project_data /path/to/dpdash.sif /sw/apps/dpdash/singularity/run.sh
    
Alternatively, you can shell into the container and then execute further commands. In fact, this would be 
the recommended method for working with the image.
    
    export DPDASH_IMG=/path/to/dpdash.sif
    singularity shell -B ${state}:/data -B ${data}:/project_data /path/to/dpdash.sif
    
    Singularity> cd /sw/apps/dpdash/singularity/
    Singularity> ./run.sh

At these point, you can even exit from the Singularity shell and yet your DPdash instance would be running.


### Import

After initializing a DPdash instance, data need to be imported inside a mongo database. This step happens outside 
the Singularity container and requires https://github.com/PREDICT-DPACC/dpimport. Follow the steps there to install and use it.

`dpimport`: `import.py` requires a [config.yml](https://github.com/PREDICT-DPACC/dpimport/blob/378f99a13a215581f91a9c7feeecefb59a506d1d/examples/config.yml). 
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


Proper values of the above keys can be found in `${state}/dpdash/configs/dpdash.js`.



#### Verify import

After `import.py`, you can verify if your data went inside mongo database:

    singularity shell -B ${state}:/data -B ${data}:/project_data /path/to/dpdash.sif
    
    Singularity> mongo --ssl --host `hostname` --sslCAFile /data/ssl/ca/cacert.pem --sslPEMKeyFile /data/ssl/mongo_client.pem


Inside mongo shell:

    > use admin
    > db.auth("username", "password")   // located in ${state}/dpdash/configs/dpdash.js
    > show dbs
    > use dpdata                        // the db name specified in config.yml for import.py
    > show collections
    > db.collection_name.findOne()      // one collection_name from the collections
    > db["collection_name"].find()      // useful when collection_name has . or - in it


#### Set up access

Assuming you have imported one `BLS_metadata.csv` file into the mongo database, take a look at the following example 
to learn how `dpdash` user is given access to the `BLS` study:
 
    Singularity> mongo --ssl --host `hostname` --sslCAFile /data/ssl/ca/cacert.pem --sslPEMKeyFile /data/ssl/mongo_client.pem

Inside mongo shell:
 
    > use admin
    > db.auth("dpdash", "password")                                   // located in ${state}/dpdash/configs/dpdash.js
    > show dbs
    > use dpdmongo
    > dp.users.find()
    > db.users.update({"uid": "dpdash"}, {$set: {"access": ["BLS"]}}) // BLS comes from BLS_metadata.csv


### View

Firstly, make sure the following prints the login page:

    curl -L http://0.0.0.0:8000

Then, try to view the login page in a web browser. Finally, enter the admin credentials and see if they work. 
If they do not, see the [Cookies](#cookies) section.

**NOTE** If you have setup DPdash in a headless remote server, you should need to set up [reverse proxy](#reverse-proxy) to be able to 
view the login page in a web browser.


### Configure

Add and enable at least one configuration from the left taskbar.


### Quit

    singularity run -B ${state}:/data -B ${data}:/project_data /path/to/dpdash.sif /sw/apps/dpdash/singularity/quit.sh

    
### Restart

Advanced users can save a good amount of time restarting the DPdash instance rather than doing a run-quit-run cycle. 
To be able to do that, define the [DPdash variables](https://github.com/PREDICT-DPACC/dpdash/blob/dcdc3ca702df688a2cc73376c2929415e0fd6c0b/singularity/run.sh#L30) in the Singularity shell:

    singularity shell -B ${state}:/data -B ${data}:/project_data /path/to/dpdash.sif
    
    Singularity> cd /sw/apps/dpdash/
    Singularity> # define the DPdash variables
    Singularity> npm restart

Similarly, you can do `npm start` or `npm stop`.


## Reverse proxy

If `curl -L http://0.0.0.0:8000` works successfully, you can go ahead and set up Nginx reverse proxy. [Here](http://docs.neuroinfo.org/dpdash/en/latest/quick_start.html#setting-up-a-reverse-proxy) are some details about it. 
Essentially, you will need to add the following section in a `server{}` block in `/etc/nginx/nginx.conf`:

```cfg
    location / {
            proxy_pass http://127.0.0.1:8000/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
    }
```

Eventually, you should be able to see DPdash login page in a web browser against your server hostname.


## Troubleshooting

### Logs

* DPdash app

        Singularity> cd /sw/apps/dpdash
        Singularity> ./node_modules/pm2/bin/pm2 logs www

Alternatively--

        tail -f ${state}/dpdash/dpdash.log


* mongodb

        tail -f ${state}/dpdash/mongodb/logs/mongod.log



### Cookies

Within DPdash, [cookies are not transferred](http://docs.neuroinfo.org/dpdash/en/latest/building.html?highlight=cookies) over unencrypted HTTP. 
For this limitation, after entering admin credentials in DPdash login page, you may be dropped back to login again. 
To circumvent this issue, set the following to `false`:

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
    > db["collection_name"].find()      // useful when collection_name has . or - in it

