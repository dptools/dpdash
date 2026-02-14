#!/bin/bash

# Set the following environment variables to deploy to Staging:
# export CLUSTER_NAME: dpDashDevCluster
# export TASK_NAME: dpDashDevTaskDefinition
# export SERVICE_NAME: dpDashDevService

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account")

docker build -t dpdash:latest .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

ECR_IMAGE="$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/dpdash:latest"

docker tag dpdash:latest $ECR_IMAGE
docker push $ECR_IMAGE

TASK_DEFINITION=$(aws ecs describe-task-definition --task-definition "$TASK_NAME" --region="us-east-1")
NEW_TASK_DEFINITION=$(echo $TASK_DEFINITION | jq --arg IMAGE "$ECR_IMAGE" '.taskDefinition | .containerDefinitions[0].image = $IMAGE | del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | del(.compatibilities) | del(.registeredAt) | del(.registeredBy)')
aws ecs register-task-definition --region "us-east-1" --cli-input-json "${NEW_TASK_DEFINITION}"
aws ecs update-service --cluster "$CLUSTER_NAME" --service "$SERVICE_NAME" --task-definition "$TASK_NAME" --force-new-deployment
