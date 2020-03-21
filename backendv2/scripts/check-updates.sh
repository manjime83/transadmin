#!/bin/bash

echo "> updating root..."
npm-check-updates --upgrade --packageFile ./package.json
DATA=($(json -f ./package.json name version))
SCOPE=${DATA[0]}
VERSION=${DATA[1]}

for DIR in functions/*; do
    if [ -d ${DIR} ]; then
        echo "> updating function $(basename $DIR)..."
        json --in-place -f ${DIR}/package.json -e "this.name = '@$SCOPE/$(basename $DIR)'; this.version = '$VERSION';"
        npm-check-updates --upgrade --packageFile ${DIR}/package.json
        echo ""
    fi
done

echo "> packages updated!"