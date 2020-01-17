#!/bin/bash
VAR_PASS=""
while [[ -z $VAR_PASS ]] || ! sudo -S echo <<< "$VAR_PASS"; do
  VAR_PASS=$(zenity --password)
  if [[ $? -eq 1 ]]; then
    zenity --notification --text "Deployment cancelled."
    break
  elif [[ $? -eq 5 ]]; then
    zenity --notification --text "Deployment cancelled due to time-out."
    break
  else 
    zenity --notification --text "Deploying Turnable to production server..."
    scp -r /gty/Sites/turnable-ui/build turnableProd:~/
    ssh turnableProd "
      echo "+$(echo $VAR_PASS)+" | sudo cp -r /home/tbarabas/build /usr/share/nginx/turnable-ui/
      exit
      exit
    "
    if [ $? -eq 0 ]; then
        echo success
    fi
  fi
done
