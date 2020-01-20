#!/bin/bash
lsof -t -i tcp:3000 | xargs kill
if [ $? -eq 0 ]; then
    zenity --notification --text "Turnable dev server stopped."
    echo success
else
    echo fail
fi
