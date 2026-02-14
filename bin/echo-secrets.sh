#!/bin/bash

# Before executing:
# Login to the AWS CLI with an account that has access to the SSM service

read -p "This script will log secret values to the console. Are you sure you wish to proceed? (y/n)"
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Staging Secret Values:"
  aws ssm get-parameter \
      --name "DPDASH_IMPORT_API_USERS_DEV" \
      --with-decryption

  aws ssm get-parameter \
      --name "DPDASH_IMPORT_API_KEYS_DEV" \
      --with-decryption

  aws ssm get-parameter \
      --name "DPDASH_SESSION_SECRET_DEV" \
      --with-decryption

  echo "Production Secret Values:"

  aws ssm get-parameter \
      --name "DPDASH_IMPORT_API_USERS" \
      --with-decryption

  aws ssm get-parameter \
      --name "DPDASH_IMPORT_API_KEYS" \
      --with-decryption

  aws ssm get-parameter \
      --name "DPDASH_SESSION_SECRET" \
      --with-decryption
fi
