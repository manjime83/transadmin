#!/bin/bash

tsc
cd functions/$1
npm install
zip -r $1.zip .
aws lambda update-function-code --function-name $npm_package_name-test-$1 --zip-file fileb://$1.zip
rm -rf node_modules $1.zip
