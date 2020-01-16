#!/bin/bash
PASSWD="$(zenity --password --title=Authentication)\n"
zenity --notification --text "Deploying Turnable to staging server..."
scp -r /gty/Sites/turnable-ui/build turnableDev:~/
ssh turnableDev "
  echo "+$(echo PASSWD)+" | sudo cp -r /home/tbarabas/build /usr/share/nginx/turnable-ui/
  exit
  exit
"
