#!/bin/bash

PACKAGE_NAME=($(echo $npm_package_name | cut -c2- | awk -F'/' '{ print $1, $2 }'))
SCOPE=${PACKAGE_NAME[0]}
PACKAGE_NAME=${PACKAGE_NAME[1]}
VERSION=${npm_package_version}

mkdir -p ../../build && cd ../../build
rm -rf $SCOPE-$PACKAGE_NAME.zip package
tar -xzf ../src/delete-note/$SCOPE-$PACKAGE_NAME-$VERSION.tgz
rm ../src/delete-note/$SCOPE-$PACKAGE_NAME-$VERSION.tgz
cd package
zip -qr ../$SCOPE-$PACKAGE_NAME.zip .
