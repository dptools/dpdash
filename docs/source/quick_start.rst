Quick Start Guide
=================
This quick start guide will show you how to download, initialize, and run DPdash
as a standalone Singularity container instance.

.. note::
   Instead of downloading a DPdash image, you can build one yourself. To do that, 
   please follow the `building tutorial <building.html>`_.

Install Singularity
-------------------
.. attention::
   Installing Singularity will require administrative privilege.

Follow the official Singularity `installation guide <https://www.sylabs.io/guides/2.6/user-guide/installation.html>`_.
We highly recommend using Singularity version 3.0 or greater.

Download the application image
------------------------------
Submit a request for the latest DPdash ``Singularity Image Format`` image by 
sending an email to ::

    dpdash@neuroinfo.org

Or you can create the DPdash image yourself by following the 
`building tutorial <building.html>`_.

Create data persistence directories
-----------------------------------
.. warning::
   When you stop a container, all data saved within the container will be
   lost unless it is saved to a bind mount.

DPdash requires two directories for successful operation, a `data directory <#data-directory>`_
to store files that should be scanned and imported into the DPdash database, and a
`state directory <#state-directory>`_ to persist the DPdash database files, log 
files, SSL certificates, and configuration files.

data directory
~~~~~~~~~~~~~~
The DPdash importer process will periodically crawl and import any DPdash
formatted text files that live under the ``data`` directory. DPdash administrators
should create a dedicated directory for these files. This directory will be shared
into the DPdash container at runtime ::

    mkdir data

This directory can exist anywhere on the host filesystem. Administrators are
free to create any non-DPdash files or subdirectories under this directory, 
however it should be understood that every filename will be inspected by the 
DPdash importer process unless the file is under a directory named ``raw``.

To keep your files neatly organized, we recommend creating a ``PHOENIX`` style 
directory tree. Generally, there should be a directory for each study and within 
each study directory additional subdirectories for each subject ::

    data
    └── STUDY_A
        └── SUBJECT_01

.. note::
   Remember that all file names under the ``data`` directory will be inspected 
   by the DPdash file importer unless the file is stored under a subdirectory 
   named ``raw``.

metadata files
~~~~~~~~~~~~~~
Within the ``data`` directory, DPdash administrators must create metadata files 
for each study. The metadata file name should contain the study name followed by 
``_metadata.csv``.

The following is the recommended metadata CSV columns and format requirements::

    Active,Study,Subject ID,Consent Date
    0,STUDY_A,SUBJECT_01,2019-01-01

Here are the formatting requirements for each column

+--------------+------------------------------+--------------+------------+
| Column       | Description                  | Format       | Example    |
+==============+==============================+==============+============+
| Active       | Indicates participant status | Boolean      | 1          |
+--------------+------------------------------+--------------+------------+
| Study        | Study ID                     | Alphanumeric | STUDY_A    |
+--------------+------------------------------+--------------+------------+
| Subject ID   | Subject ID                   | Alphanumeric | SUBJECT_01 |
+--------------+------------------------------+--------------+------------+
| Consent Date | Consent date                 | ``%Y-%m-%d`` | 2019-01-01 |
+--------------+------------------------------+--------------+------------+

The DPdash importer process will read these metadata files and use the
``Consent Date`` field to add relative date-specific information to each
dashboard page.

state directory
~~~~~~~~~~~~~~~
DPdash administrators must create a dedicated directory to persist the DPdash
state. DPdash state includes any database files, log files, configuration files, 
and internally used SSL certificates. This directory will be shared into the 
DPdash container at runtime ::

    mkdir state

This directory can exist anywhere on the host filesystem.

Initialize DPdash
-----------------
Before you can start DPdash, there are several steps that must be performed 
by you, **within your environment**. These steps include initializing the 
database, initializing the queuing system, generating SSL certificates, 
generating any service-related usernames, passwords, and so on. The DPdash 
repository includes an initialization script to streamline this task.

clone the repository
~~~~~~~~~~~~~~~~~~~~
.. note::
   If you haven’t downloaded or generated a DPdash application image, please 
   follow the `instructions above <#download-the-application-image>`_.

Clone the DPdash repository, change into the ``singularity`` directory, and 
copy (or move) your ``dpdash.sif`` image file into that directory ::

    git clone https://github.com/harvard-nrg/dpdash.git
    cd dpdash/singularity
    cp /path/to/dpdash.sif .

run the initialization script
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
The initialization script will configure the database, queuing system, generate
any necessary SSL certificates, any necessary service-related usernames, passwords, 
and render the templated configuration files (exhale).

.. attention::
   You cannot resume DPdash initialization from a failed state. If you encounter 
   any issue with this step and need to re-run ``init.sh``, be sure to delete the 
   entire contents of the `state directory <#state-directory>`_.

To begin the initialization process, execute the ``init.sh`` script. In the command 
below, be sure to replace ``${data}`` with the absolute path to your 
`data directory <#data-directory>`_ and ``${state}`` with the absolute path to your 
`state directory <#state-directory>`_ ::

    bash init.sh ${data} ${state}

Starting
--------
To start DPdash, simply start an instance of the ``dpdash.sif``. In the command 
below, be sure to replace ``${data}`` with the absolute path to your 
`data directory <#data-directory>`_ and ``${state}`` with the absolute path to your 
`state directory <#state-directory>`_ ::

    singularity instance start \
        -B ${state}:/data \
        –B ${data}:${data} \
        dpdash.sif \
        dpdash

.. note::
   The last argument to ``singularity instance start`` is the name you will use 
   to refer to the container instance e.g., ``instance://dpash``.

Stopping
--------
To stop DPdash, execute the ``quit.sh`` script within the container. This will stop 
any databases and other services gracefully ::

    singularity exec instance://dpdash /data/scripts/quit.sh

Now you can safely stop the Singularity instance ::

    singularity instance stop dpdash

Setting up a reverse proxy
--------------------------
.. attention::
   Installing NGINX, copying SSL certificates under /etc, and binding to ports
   below 1024 all require superuser privileges.

By default, DPdash listens over HTTP on port ``8000`` on ``0.0.0.0``. These details 
are configurable within the DPdash configuration file. It is highly recommended that 
you change the network interface to the loopback ``127.0.0.1`` and use a reverse proxy.

Your reverse proxy should accept incoming requests over HTTPS (port ``443``), on an
external network interface and forward traffic to DPdash running on ``127.0.0.1:8000`` 
as illustrated below

.. image:: images/reverse_proxy.png
   :width: 900

We recommend that you use NGINX for your reverse proxy. To install NGINX, refer
to the `official documentation <https://www.nginx.com/resources/wiki/start/topics/tutorials/install/>`_.
To configure NGINX as a reverse proxy, again refer to the 
`documentation <https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/>`_.

.. note::
   Most web browsers will present a security warning if your application does
   not provide a valid SSL certificate, or if your application provides one that 
   is not signed by a recognized Certificate Authority. Contact your system 
   administrator for a properly signed SSL certificate.

