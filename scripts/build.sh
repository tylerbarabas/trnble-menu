#!/bin/bash
cd /gty/Sites/turnable-ui
yarn build
if [ $? -eq 0 ]; then
    echo success
else
    echo fail
fi
