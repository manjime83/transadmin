#!/bin/bash

rm -rf build

mkdir -p build/nodejs && cp package.json $_
cd build/nodejs && npm install --production && cd ..
find . -exec touch -t 8510260120 {} +
mkdir -p ../dist/layers && zip -qr ../dist/layers/$npm_package_name.zip .
sha256sum ../dist/layers/$npm_package_name.zip


# tsc

# cd build

# find . -exec touch -t 8510260120 {} +

# mkdir -p ../dist
# for lambda in $(find . -maxdepth 1 -name "*.js" -type f); do
#     echo "> lambda ${lambda}..."
#     zip -qr ../dist/$(basename $lambda).zip $lambda lib node_modules
# done
