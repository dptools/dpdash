#!/bin/bash

# Getting environment variables from .env
source ./loadenv.sh
# Check if required variables are defined
source ./varcheck.sh

containerDataDir=$state
if [ ! -d $containerDataDir ]; then
    echo "$containerDataDir does not exist"
    exit 1
fi
if [ ! -z ${DPDASH_SERVICE_HOST} ]
then 
    serviceHost=$DPDASH_SERVICE_HOST
else
    serviceHost=`hostname -f | xargs`
fi
cd ${containerDataDir}/ssl/ca

echo 'Revoking existing certs'
dirpath=${containerDataDir}/ssl/ca/certs
for certfile in "$dirpath"/*.pem; do
    openssl ca -config openssl.cnf -revoke $certfile
done

echo 'Generating CAs'
openssl req -x509 -config openssl.cnf -newkey rsa:4096 -days 365 \
    -out cacert.pem -outform PEM -subj /CN=DPdashCA/ -nodes
openssl x509 -in cacert.pem -out cacert.cer -outform DER

echo 'Generating server keys'
cd ../server
openssl genrsa -out key.pem 4096
openssl req -new -key key.pem -out req.pem -outform PEM \
    -subj "/CN=${serviceHost}/O=server/" -nodes

cd ../ca
openssl ca -config openssl.cnf -in ../server/req.pem -out \
    ../server/cert.pem -notext -batch -extensions server_ca_extensions

echo 'Generating client keys'
cd ../client
openssl genrsa -out key.pem 4096
openssl req -new -key key.pem -out req.pem -outform PEM \
    -subj "/CN=${serviceHost}/O=client/" -nodes

cd ../ca
openssl ca -config openssl.cnf -in ../client/req.pem -out \
    ../client/cert.pem -notext -batch -extensions client_ca_extensions

echo 'Generating Mongodb keys'
cat ${containerDataDir}/ssl/server/key.pem ${containerDataDir}/ssl/server/cert.pem > ${containerDataDir}/ssl/mongo_server.pem
cat ${containerDataDir}/ssl/client/key.pem ${containerDataDir}/ssl/client/cert.pem > ${containerDataDir}/ssl/mongo_client.pem
