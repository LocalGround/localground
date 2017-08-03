SETTINGS_FILE="../apps/settings_local.py"
DEV="DEBUG = True"
PROD="DEBUG = False"
if [ "$1" = "prod" ]; then
   sudo sed -i "s/$DEV/$PROD/g" $SETTINGS_FILE
else
  echo
  echo 'please provide location {home|away}'
fi
grunt --gruntfile ../GruntFile.js
sudo service apache2 restart
