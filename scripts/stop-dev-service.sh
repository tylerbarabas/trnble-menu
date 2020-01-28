#!/bin/bash
lsof -t -i tcp:8080 | xargs kill
if [ $? -eq 0 ]; then
    zenity --notification --text "Turnable dev service stopped."
    echo success
else
    echo fail
fi
