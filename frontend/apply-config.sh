#!/bin/bash

# cd $1;
sed "s/__SERVER__/\"$APP_SERVER\"/;s/__PORT__/$APP_PORT/" state.js.def > ./scripts/state.js