#!/bin/bash

aws cloudformation package --template-file transadmin.yaml --s3-bucket transadmin.co-templates --output-template-file packaged.yaml
aws cloudformation deploy --template-file packaged.yaml --stack-name transadmin-$1 --capabilities CAPABILITY_NAMED_IAM --parameter-overrides \
    EnvType=$1