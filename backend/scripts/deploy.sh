#!/bin/bash

aws s3 sync . s3://transadmin.co/.aws/${1:-test} --exclude "*" --include swagger.yaml

aws cloudformation package --template-file template.yaml --s3-bucket transadmin.co --s3-prefix .aws/${1:-test} --output-template-file .aws/template.yaml

aws cloudformation deploy --template-file .aws/template.yaml --stack-name transadmin-${1:-test} --capabilities CAPABILITY_NAMED_IAM --no-fail-on-empty-changeset \
    --parameter-overrides ProjectName=transadmin Environment=${1:-test}

aws cloudformation describe-stacks --stack-name transadmin-${1:-test} --query "Stacks[0].{StackStatus:StackStatus,StackStatusReason:StackStatusReason,Outputs:Outputs}"