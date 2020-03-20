#!/bin/bash

PACKAGE_NAME=($(echo $npm_package_name | cut -c2- | awk -F'/' '{ print $1, $2 }'))
SCOPE=${PACKAGE_NAME[0]}
PACKAGE_NAME=${PACKAGE_NAME[1]}

AWS_PROFILE=default

cd ../../dist
aws lambda update-function-code --function-name $SCOPE-$PACKAGE_NAME-${NODE_ENV:-development} --zip-file fileb://$SCOPE-$PACKAGE_NAME.zip
