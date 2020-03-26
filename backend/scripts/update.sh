#!/bin/bash

mkdir -p .aws/functions

find .aws/functions -mindepth 1 -name $1.zip -delete

tsc
find .aws/build -exec touch -t 8510260120 {} +

cd .aws/build
cp -p $1.js index.js
zip -Xqr ../functions/$1.zip index.js lib
sha256sum ../functions/$1.zip
rm index.js

aws lambda update-function-code --function-name $npm_package_name-test-$1 --zip-file fileb://../functions/$1.zip