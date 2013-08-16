#!/bin/bash
# ----------------------------------------------------------------------------------
# To redirect the output of this script to a log file, call it
# as follows:
# $./setup.sh | perl -ne '$|=1; print localtime . ": [./setup.sh] $_"' >> setup.log
echo
echo
echo "///////////////////////////////////////////////////"
TIMESTAMP=$(date +%m/%d/%y\ %H:%M:%S)
echo "Configuring Local Ground Server ($TIMESTAMP)"
echo "///////////////////////////////////////////////////"
echo

################################
# Default application parameters
################################
# Override these variables with your own by creating a file called
# "local_config.sh" and setting your own values for these variables
FILE_ROOT="/path/to/localground"
SERVER_HOST="localground.org"
CGI_PATH="/usr/lib/cgi-bin"
MAP_CGI_PATH="/var/www/ows"
GDAL_PATH="/usr/lib/libgdal.so.1.16.2"

DB_HOST="127.0.0.1"
DB_PORT="5432"
DB_USER="USER"
DB_PASSWORD="PASSWORD"
DB_NAME="DATABASE_NAME"

ADMIN_EMAIL_ADDRESS="your_email@gmail.com"
USER_ACCOUNT="www-data"  
GROUP_ACCOUNT="www-data"
CLOUDMADE_KEY="YOUR_CLOUDMADE_API_KEY"

sites_available="/etc/apache2/sites-available"
sites_enabled="/etc/apache2/sites-enabled"

##############################
# Override with local config #
##############################

if [ -f local_config.sh ]
then
	source local_config.sh
fi

##################
# Helper Functions
##################
set_val()
{ 
	# param1 = message, param2 = variable to be set
	read -p "$1" tmp
	if [ "$tmp" != "" ]
	then
		echo $tmp
	else
		echo $2
	fi
}

escape()
{
	tmp=$(echo $1 | sed 's/\//\\\//g')
	echo $tmp | sed 's/\./\\./g'
}

sudo_noprompt()
{
	SUDO_MESSAGE="Executing \"$1\" with sudo privs"
	if [ -z "$SUDOPASS" ]
	then
		echo "$SUDO_MESSAGE: authentication needed from sudoers file or prompt"
                sudo $1
	else
		echo "$SUDO_MESSAGE: sudo password set"
		echo $SUDOPASS | sudo -S $1
	fi
}

# Prompt user for variables
FILE_ROOT=$(set_val "Please enter the path to your code (defaults to \"$FILE_ROOT\"): " $FILE_ROOT)
SERVER_HOST=$(set_val "Please enter your domain name (defaults to \"$SERVER_HOST\"): " $SERVER_HOST)
CGI_PATH=$(set_val "Please enter the path to your cgi-bin directory (defaults to \"$CGI_PATH\"): " $CGI_PATH)
MAP_CGI_PATH=$(set_val "Please enter your map server & tilecache cgi path (defaults to \"$MAP_CGI_PATH\"): " $MAP_CGI_PATH)
DB_HOST=$(set_val "Please enter your postgres database host name (defaults to \"$DB_HOST\"): " $DB_HOST)
DB_PORT=$(set_val "Please enter your postgres database port number (defaults to \"$DB_PORT\"): " $DB_PORT)
DB_USER=$(set_val "Please enter your postgres database username (defaults to \"$DB_USER\"): " $DB_USER)
DB_PASSWORD=$(set_val "Please enter your postgres database password: " $DB_PASSWORD)
DB_NAME=$(set_val "Please enter your postgres database name (defaults to \"$DB_NAME\"): " $DB_NAME)
GDAL_PATH=$(set_val "Please enter your GDAL path (defaults to \"$GDAL_PATH\"): " $GDAL_PATH)
ADMIN_EMAIL_ADDRESS=$(set_val "Please enter your admin email address (defaults to \"$ADMIN_EMAIL_ADDRESS\"): " $ADMIN_EMAIL_ADDRESS)
USER_ACCOUNT=$(set_val "Please enter the Linux user account that you would like the system to use when writing files (defaults to \"$USER_ACCOUNT\"): " $USER_ACCOUNT)
WEBSERVER_ACCOUNT=$(set_val "Please enter the Linux group account that you would like the system to use when writing files (defaults to \"$WEBSERVER_ACCOUNT\"): " $WEBSERVER_ACCOUNT)
CLOUDMADE_KEY=$(set_val "Please enter your CloudMade API key (defaults to \"$CLOUDMADE_KEY\"): " $CLOUDMADE_KEY)

echo
echo "Your code path is: \"$FILE_ROOT\""
echo "Your domain name is: \"$SERVER_HOST\""
echo "Your cgi-bin path is: \"$CGI_PATH\""
echo "Your MapServer & Tilecache path is: \"$MAP_CGI_PATH\""
echo "Your database host name is: \"$DB_HOST\""
echo "Your database port is: \"$DB_PORT\""
echo "Your database user is: \"$DB_USER\""
echo "Your database name is: \"$DB_NAME\""
echo "Your GDAL path is: \"$GDAL_PATH\""
echo "Your admin email address is: \"$ADMIN_EMAIL_ADDRESS\""
echo "Your Linux user account is: \"$USER_ACCOUNT\""
echo "Your Linux web server account is: \"$WEBSERVER_ACCOUNT\""
echo "Your Cloudmade Key is: \"$CLOUDMADE_KEY\""
echo

############################################
# Substitute variables into Apache Conf file
############################################
sed "s/{{FILE_ROOT}}/$(escape $FILE_ROOT)/g" apache_config > apache_config.tmp
sed -i "s/{{SERVER_HOST}}/$(escape $SERVER_HOST)/g" apache_config.tmp
sed -i "s/{{CGI_PATH}}/$(escape $CGI_PATH)/g" apache_config.tmp
sed -i "s/{{MAP_CGI_PATH}}/$(escape $MAP_CGI_PATH)/g" apache_config.tmp

#############################################
# Substitute variables into settings_local.py
#############################################
sed "s/{{GDAL_PATH}}/$(escape $GDAL_PATH)/g" settings_local.py > settings_local.py.tmp
sed -i "s/{{FILE_ROOT}}/$(escape $FILE_ROOT)/g" settings_local.py.tmp
sed -i "s/{{SERVER_HOST}}/$(escape $SERVER_HOST)/g" settings_local.py.tmp
sed -i "s/{{DB_HOST}}/$(escape $DB_HOST)/g" settings_local.py.tmp
sed -i "s/{{DB_PORT}}/$(escape $DB_PORT)/g" settings_local.py.tmp
sed -i "s/{{DB_USER}}/$(escape $DB_USER)/g" settings_local.py.tmp
sed -i "s/{{DB_PASSWORD}}/$(escape $DB_PASSWORD)/g" settings_local.py.tmp
sed -i "s/{{DB_NAME}}/$(escape $DB_NAME)/g" settings_local.py.tmp
sed -i "s/{{ADMIN_EMAIL_ADDRESS}}/$(escape $ADMIN_EMAIL_ADDRESS)/g" settings_local.py.tmp
sed -i "s/{{USER_ACCOUNT}}/$(escape $USER_ACCOUNT)/g" settings_local.py.tmp
sed -i "s/{{GROUP_ACCOUNT}}/$(escape $WEBSERVER_ACCOUNT)/g" settings_local.py.tmp
sed -i "s/{{CLOUDMADE_KEY}}/$(escape $CLOUDMADE_KEY)/g" settings_local.py.tmp

# Moving Apache Config File to /etc/apache2/sites-available directory
echo "Moving apache config file \"$SERVER_HOST\" to \"$sites_available\" directory......"
sudo_noprompt "mv apache_config.tmp $sites_available/$SERVER_HOST"
#echo $SUDOPASS | sudo -S mv apache_config.tmp $sites_available/$SERVER_HOST
echo "Enabling..."
#echo $SUDOPASS | sudo -S a2ensite $SERVER_HOST
sudo_noprompt "a2ensite $SERVER_HOST"

###########################################
# Update file permissions and make a media 
# directory to store user-generated content 
###########################################
sudo_noprompt "mkdir ../userdata/media"
sudo_noprompt "mkdir ../userdata/prints"
# add the $USER_ACCOUNT to the webserver group, so that cronjobs can
# write files to userdata.  To verify: $ groups $USER_ACCOUNT
sudo_noprompt "usermod -a -G $WEBSERVER_ACCOUNT $USER_ACCOUNT"
sudo_noprompt "chown -R $WEBSERVER_ACCOUNT:$WEBSERVER_ACCOUNT ../userdata"
sudo_noprompt "chmod -R 775 ../userdata"
sudo_noprompt "find userdata -type d -exec chmod 2775 {} \;"
sudo_noprompt "find userdata -type f -exec chmod ug+rw {} \;"

# sudo usermod -a -G www-data my_account
# sudo chgrp -R userdata
# sudo chmod -R g+w userdata
# sudo find userdata -type d -exec chmod 2775 {} \;
# sudo find userdata -type f -exec chmod ug+rw {} \;



#Copying settings_local.py to apps directory
mv settings_local.py.tmp ../apps/settings_local.py

###########################################
# Destroying and Re-Creating the Database #
###########################################
#echo "Dropping and rebuilding the database \"$DB_NAME\"..."
#sudo_noprompt "-u postgres dropdb $DB_NAME"
#sudo_noprompt "-u postgres createdb -T template_postgis -O $DB_USER -E UTF8 -e $DB_NAME"

# Restarting Apache:
#sudo_noprompt "service apache2 restart"
#python ../apps/manage.py syncdb --noinput


#####################
# Add GIS projections
#####################
sudo_noprompt "chmod +x gis.sh"
./gis.sh

###########
# Run Tests
###########
echo
echo
echo 'Running Django Tests...'
sudo_noprompt "-u $USER_ACCOUNT python ../apps/manage.py test site --verbosity=2"
