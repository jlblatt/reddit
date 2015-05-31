#!/bin/bash

UH=$1
KIND=$2
URL=$3
SR=$4
TITLE=$5
USER=$6

#RES=`curl -b cookies/$USER.txt -d kind=$KIND -d url=$URL -d text=$URL -d sr=$SR -d r=$SR -d renderstyle=html -d "title=$TITLE" -d uh=$UH http://www.reddit.com/api/submit`

echo "Content-type: text/html"
echo ""
#echo $RES
echo "Congratulations- you have found where I stopped working because I didn't have time to figure out the captcha.  Thanks for playing!"
