#!/bin/bash

USER=$1
PASS=$2

JSON=`curl -d user=$USER -d passwd=$PASS -c cookies/$USER.txt http://www.reddit.com/api/login`
COOK=`cat cookies/$USER.txt | grep reddit_session`

echo "Content-type: text/html"
echo ""
echo $COOK