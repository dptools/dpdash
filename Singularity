Bootstrap:docker
From:centos:7.4.1708


%labels
	AUTHOR jisoolily_jeong@harvard.edu
	AUTHOR timothy_okeefe@harvard.edu
	AUTHOR hhoke@fas.harvard.edu
	
	AUTHOR and MAINTAINER tbillah@bwh.harvard.edu
	

%post
	## Set data path
	mkdir -p /sw/apps/
	mkdir -p /data/dpdash/
	cd /sw/apps/

    
	## update yum and install some useful things
	yum -y update
	yum -y groupinstall "Development tools"
	yum install epel-release
	yum -y install net-tools telnet wget git tar which \
		whereis bzip2 p7zip vim vi vixie-cron cronie sudo

	
	## install the RabbitMQ message queue
	wget https://github.com/rabbitmq/erlang-rpm/releases/download/v19.3.6.13/erlang-19.3.6.13-1.el7.centos.x86_64.rpm
	yum -y install erlang-19.3.6.13-1.el7.centos.x86_64.rpm
	wget http://www.rabbitmq.com/releases/rabbitmq-server/v3.6.9/rabbitmq-server-3.6.9-1.el6.noarch.rpm
	rpm --import https://www.rabbitmq.com/rabbitmq-signing-key-public.asc
	yum -y install rabbitmq-server-3.6.9-1.el6.noarch.rpm


	## install miniconda3
    wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh -O Miniconda3-latest-Linux-x86_64.sh
    /bin/bash Miniconda3-latest-Linux-x86_64.sh -b -p miniconda3/
	source miniconda3/bin/activate

	## install the Node.js run-time
	yum -y install nodejs

	## install the MongoDB document database
	echo -e "[mongodb-org-3.4]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/7/mongodb-org/3.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.4.asc" >> /etc/yum.repos.d/mongodb-org-3.4.repo

	yum -y install mongodb-org
	

	## install the Celery asyncronous task queue
	pip install celery


	## install the DPdash digital phenotyping dashboard
	mkdir -p dpdash && cd dpdash
	git clone https://ncfcode.rc.fas.harvard.edu/dpdash/dpdash.git . 
	rm -rf ./node_modules
	npm install --save .
	npm run build

nvironment
export PATH=/sw/apps/miniconda/bin:$PATH

