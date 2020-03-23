#!/bin/bash

echo "> updating root..."
npm-check-updates --upgrade --packageFile ./package.json
DATA=($(json -f ./package.json name version))
SCOPE=${DATA[0]}
VERSION=${DATA[1]}

for DIR in $(find functions -mindepth 1 -maxdepth 1 -type d); do
    FUNCTION_NAME=$(basename $DIR)
    echo "> updating function $FUNCTION_NAME..."
    json --in-place -f ${DIR}/package.json -e "this.name = '@$SCOPE/$FUNCTION_NAME'; this.version = '$VERSION';"
    npm-check-updates --upgrade --packageFile ${DIR}/package.json
    echo ""
done

echo "> packages updated!"