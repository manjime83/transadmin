#!/bin/bash

ENV=${1:-test}

PROJECT_NAME='transadmin'

aws cloudformation package --template-file template.yaml --s3-bucket $PROJECT_NAME-devops --s3-prefix $ENV --output-template-file .aws/template.yaml

aws cloudformation deploy --template-file .aws/template.yaml --stack-name $PROJECT_NAME-$ENV --capabilities CAPABILITY_NAMED_IAM --no-fail-on-empty-changeset \
    --parameter-overrides ProjectName=$PROJECT_NAME Environment=$ENV $(cat template.$ENV.env | tr -s [:space:] ' ')

aws cloudformation describe-stacks --stack-name $PROJECT_NAME-$ENV --query "Stacks[0].{StackStatus:StackStatus,StackStatusReason:StackStatusReason,Outputs:Outputs}"