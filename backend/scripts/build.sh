#!/bin/bash

rm -rf build
tsc
cp functions/package.json build/package.json
npm install --production --nodedir=build
find build -exec touch -t 8510260120 {} +
