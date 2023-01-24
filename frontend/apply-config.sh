#!/bin/bash

cd $1;
sed "s/__SERVER__/\"$(echo $APP_SERVER)\"/;s/__PORT__/$(echo $APP_PORT)/" state.js.def > ./scripts/state.js