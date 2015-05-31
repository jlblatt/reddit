#!/bin/bash

ID=$1
DIR=$2
#VH=$3
VH="<$>votehash</$>"
UH=$4
USER=$5

RES=`curl -b cookies/$USER.txt -d id=$ID -d dir=$DIR -d vh=$VH -d uh=$UH http://www.reddit.com/api/vote`

echo "Content-type: text/html"
echo ""
echo $RES
