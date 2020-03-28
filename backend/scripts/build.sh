#!/bin/bash

mkdir -p .aws/build/nodejs
mkdir -p .aws/layers .aws/functions

find .aws/build/nodejs -mindepth 1 -delete
find .aws/layers -mindepth 1 -delete
find .aws/functions -mindepth 1 -delete

cd .aws/build/nodejs
cp ../../../package*.json .
npm ci --production
rm package*.json
cd ../../..

tsc
find .aws/build -exec touch -t 8510260120 {} +

cd .aws/build
zip -Xqr ../layers/$npm_package_name.zip nodejs
for lambda in $(find . -maxdepth 1 -name "*.js" -type f); do
    cp -p $lambda index.js
    zip -Xqr ../functions/$(basename $lambda .js).zip index.js lib
done
rm index.js

cd..
curl https://api.swaggerhub.com/apis/transadmin.co/transadmin-api/1.0.0/swagger.yaml --output swagger.yaml --silent