#!/bin/bash

[ -d functions/$1 ] || { echo "Function '$1' not found."; exit 1; }

cd functions/$1
npm install --production --no-package-lock
zip -qr ../../.aws-sam/$1.zip .
aws lambda update-function-code --function-name $npm_package_name-test-$1 --zip-file fileb://../../.aws-sam/$1.zip
rm -rf node_modules
