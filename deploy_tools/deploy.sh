# Before running this file, ensure that you
# have switched to the correct user account
# and that you are in the root localground directory
SETTINGS_FILE="apps/settings_local.py"
DEV="DEBUG = True"
PROD="DEBUG = False"
if [ "$1" = "prod" ]; then
    echo ''
    echo 'Configuring production mode and building minified JS files...'
    echo ''
    sed -i "s/$DEV/$PROD/g" $SETTINGS_FILE
    grunt --gruntfile ../Gruntfile.js
else
    echo ''
    echo 'Configuring dev mode...'
    echo ''
    sed -i "s/$PROD/$DEV/g" $SETTINGS_FILE
fi
python apps/manage.py migrate
exit
sudo service uwsgi restart
echo ''
echo 'Done.'
echo ''
