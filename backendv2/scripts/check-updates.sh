#!/bin/bash

echo "> updating root..."
npx npm-check-updates --upgrade --packageFile ./package.json

for dir in functions/*; do
    if [ -d ${dir} ]; then
        echo "> updating function $(basename $dir)..."
        npx npm-check-updates --upgrade --packageFile ${dir}/package.json
        echo ""
    fi
done

echo "> packages updated!"