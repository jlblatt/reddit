#!/bin/bash

URL=$1
ARGS=$2
USER=$3

RES=`curl -b cookies/$USER.txt http://www.reddit.com$URL.json?$ARGS`

echo "Content-type: text/json"
echo ""
echo $RES