#!/bin/bash
sleep 30
NODE_TLS_REJECT_UNAUTHORIZED = "0";
node ./node-server/app.js $1 $2 $3 $4
