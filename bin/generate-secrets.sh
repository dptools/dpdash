#!/bin/bash

# Before executing:
# Login to the AWS CLI with an account that has access to the SSM service

# Set an environment variable as a comma separated list of usernames for the
# staging API users named DPDASH_IMPORT_API_USERS_DEV

# Set an environment variable as a comma separated list of usernames for the
# production API users named DPDASH_IMPORT_API_USERS

aws ssm put-parameter \
    --name "DPDASH_IMPORT_API_USERS_DEV" \
    --value $DPDASH_IMPORT_API_USERS_DEV \
    --type SecureString \
    --tags "Key=Name,Value=dpdash"

aws ssm put-parameter \
    --name "DPDASH_IMPORT_API_USERS" \
    --value $DPDASH_IMPORT_API_USERS \
    --type SecureString \
    --tags "Key=Name,Value=dpdash"

export DPDASH_NUMBER_OF_USERS_DEV=$(($(echo $DPDASH_IMPORT_API_USERS_DEV | tr -cd , | wc -c) + 1))
aws ssm put-parameter \
    --name "DPDASH_IMPORT_API_KEYS" \
    --value $(
      for i in seq $DPDASH_NUMBER_OF_USERS_DEV; do
        echo $(openssl rand -base64 32 | tr -d "+=/")
      done | tr '\n' ','
    ) \
    --type SecureString \
    --tags "Key=Name,Value=dpdash"

export DPDASH_NUMBER_OF_USERS=$(($(echo $DPDASH_IMPORT_API_USERS | tr -cd , | wc -c) + 1))
aws ssm put-parameter \
    --name "DPDASH_IMPORT_API_KEYS" \
    --value $(
      for i in seq $DPDASH_NUMBER_OF_USERS; do
        echo $(openssl rand -base64 32 | tr -d "+=/")
      done | tr '\n' ','
    ) \
    --type SecureString \
    --tags "Key=Name,Value=dpdash"

aws ssm put-parameter \
    --name "DPDASH_SESSION_SECRET" \
    --value $(openssl rand -base64 32 | tr -d "+=/") \
    --type SecureString \
    --tags "Key=Name,Value=dpdash"

aws ssm put-parameter \
    --name "DPDASH_SESSION_SECRET_DEV" \
    --value $(openssl rand -base64 32 | tr -d "+=/") \
    --type SecureString \
    --tags "Key=Name,Value=dpdash"
