#!/bin/bash

mkdir -p build/nodejs
mkdir -p .aws/layers .aws/functions

find build/nodejs -mindepth 1 -type f -delete
find .aws -mindepth 1 -type f -delete

cd build/nodejs
cp ../../package.json .
npm install --production --no-package-lock
rm package.json
cd ../..

tsc
find build -exec touch -t 8510260120 {} +

cd build
zip -qr ../.aws/layers/$npm_package_name.zip nodejs
for lambda in $(find . -maxdepth 1 -name "*.js" -type f); do
    cp -p $lambda index.js
    zip -qr ../.aws/functions/$(basename $lambda .js).zip index.js lib
done
rm index.js
