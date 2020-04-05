#!/bin/bash

mkdir -p .aws/build/nodejs .aws/layers .aws/functions

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
# mv ../layers/$npm_package_name.zip ../layers/$(sha256sum ../layers/$npm_package_name.zip | cut -d ' ' -f 1).zip
for lambda in $(find . -maxdepth 1 -name "*.js" -type f); do
    cp -p $lambda index.js
    zip -Xqr ../functions/$(basename $lambda .js).zip index.js lib
    rm index.js
    # mv ../functions/$(basename $lambda .js).zip ../functions/$(sha256sum ../functions/$(basename $lambda .js).zip | cut -d ' ' -f 1).zip
done
