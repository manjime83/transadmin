#!/bin/bash

mkdir -p build/nodejs
mkdir -p aws/layers aws/functions

find build/nodejs -mindepth 1 -delete
find aws -mindepth 1 -delete

cd build/nodejs
cp ../../package.json .
npm install --production --no-package-lock
rm package.json
cd ../..

echo $PWD

tsc
find build -exec touch -t 8510260120 {} +



# find . -exec touch -t 8510260120 {} +
# zip -qr ../dist/layers/$npm_package_name.zip .
# cd ..








# mkdir -p ../dist
# for lambda in $(find . -maxdepth 1 -name "*.js" -type f); do
#     echo "> lambda ${lambda}..."
#     zip -qr ../dist/$(basename $lambda).zip $lambda lib node_modules
# done
