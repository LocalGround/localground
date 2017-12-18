#!/bin/bash
#title          :setup.sh
#description    :LocalGround configuration and installation script
#author         :brian@newday.host
#date           :20171208
#version        :0.1.4
#usage          :./localground.sh
#notes          : break up script to includes.
#bash_version   :4.3.48(1)-release
#============================================================================

#TODO: Create virtualenv?
#TODO: Put Django on uWSGI use a socket instead of a port, update nginx config.
#TODO: Config Firewall, sudo ufw allow 'Nginx Full' &&  ufw delete allow 'Nginx HTTP'
#if vagrant - don't pull repository from git
#
#create service that autostarts "python manage.py runserver 0.0.0.0:8000"
#
#
# cd $HOME/Documents/Business/Clients/UC Berk/localground vagrant up
# git commit -am "Config Vagrantfile to use root for setup.sh?"
# git push

##################################
##								##
#	      DEFAULTS		 	     #
##								##
##################################
#
# This section sets default paths and strings.
#

## Set defaults
log_file="$(pwd)/localground.log"
repository='https://github.com/LocalGround/localground.git'
gitbranch='nginx-config'
owner=$(whoami | awk '{print $1}')
sitesEnabled='/etc/nginx/sites-enabled/'
sitesAvailable='/etc/nginx/sites-available/'
sslsnippet='/etc/nginx/snippets/ssl-localground.conf'

DJANGO_DEBUG=True
REGISTRATION_OPEN=True
GDAL_LIBRARY_PATH='/usr/lib/libgdal.so.1'

USER_ACCOUNT=$USER	#account to use for creating new OS files / directories
GROUP_ACCOUNT='www-data' #group to use for creating new OS files / directories


##################################
##				##
#	   BASIC CHECKS		 #
##				##
##################################
#
# This section provides basic checks before we can proceed.
#

## Print Logfile message
echo -e $"===================================="
echo -e $"! NOTICE: Logfile started at: '$log_file'."
echo -e $"==================================== \n"
## Root Check
if [ "$(whoami)" != 'root' ]; then
	echo -e $"✗ FAIL: You have no permission to run $0 as non-root user. Please use sudo. \n"
		exit 1;
fi

## Check if we're using debian/ubuntu
if which apt > /dev/null 2> /dev/null
	then echo -e $"✓ SUCCESS: This is a Debian / Ubuntu system!" | tee -a "$log_file"
	else echo -e $"✗ FAIL: This is a rpm system. \n" | tee -a "$log_file"
		exit 1;
fi

## Check if SSL Perms directory exists or not.
    echo -e $"? CHECK: '/etc/ssl/certs/'" | tee -a "$log_file"
if ! [ -d /etc/ssl/certs/ ]; then
	### create the directory
	mkdir /etc/ssl/certs/
	### give permission to root dir
	chmod 755 /etc/ssl/certs/
fi
    echo -e $"✓ SUCCESS: '/etc/ssl/certs/' exists!" | tee -a "$log_file"

## Add some space.
    echo -e $"==================================== \n\n\n"

##################################
## CONFIGURING VARIABLES		##
## d) development               ##
## p) production                ##
##################################
while getopts ":dp" opt; do
  case $opt in
	#############################################
  	## DEVELOPMENT ENVIRONMENT (d)             ##
  	#############################################
    d)

      	echo "-d Development Env was triggered!" >&2
		development=true
		domain=localground
		SERVER_HOST=localhost:7777
		PROTOCOL=http
		emailaddr=localgrounddev@mailinator.com
		userDir='/'
		rootDir=localground
		FILE_PATH="/vagrant/deploy_tools/"

		USER=localground
		DB_PASS=$(openssl rand -hex 32)
		DB_NAME=lg_test_database
		SENDGRID_API_KEY=sendgridapidefault
		MAPBOX_API_KEY=mapboxapidefault
		SOCIAL_AUTH_GOOGLE_OAUTH2_KEY=google_oauth
		SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET=google_oauth_secret
		AWS_ACCESS_KEY_ID=AWS_Access_ID
		AWS_SECRET_ACCESS_KEY=aws_secret_access_key_id
		AWS_STORAGE_BUCKET_NAME=aws_storage_bucket

		USER_ACCOUNT=$USER	#account to use for creating new OS files / directories
		GROUP_ACCOUNT='www-data' #group to use for creating new OS files / directories
      	;;

	############################################
	## PRODUCTION ENVIRONMENT (p)             ##
	############################################
	p)
      	echo "-p Production Env was triggered!" >&2
        domain=$(dig +short myip.opendns.com @resolver1.opendns.com).xip.io
        development=false
		DJANGO_DEBUG=False
		FILE_PATH = ""

		## Email config
		read -p "Enter your Email Address [localgrounddev@mailinator.com]: " email
		## Validate Email address
		emailaddr=${email:-localgrounddev\@mailinator.com}
		if [[ $emailaddr =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$ ]]
		then
		echo "Email address $emailaddr is valid." | tee -a "$log_file"
		else
		echo "Email address $emailaddr is invalid." | tee -a "$log_file"
		fi

		## Domain Name setup
		## make while dev = false to better support the host/domain q.
		if [ "$development" = false ] ; then
			read -p "Enter your Domain Name [$domain]: " name
			domain=${name:-$domain}
			SERVER_HOST=domain
			PROTOCOL=https
			## Check if domain already exists
			if [ -e $sitesAvailable$domain ]; then
				echo -e $"This domain already exists.\nPlease Try Another one" | tee -a "$log_file"
				exit;
			fi
		fi
		echo -e $"✓ SUCCESS: Host / Domain: $domain \n" | tee -a "$log_file"

		## Root Dir config
		read -p "Enter the Root Directory [/var/www/$domain]: " directory
		if [[ "$rootDir" =~ ^/ ]]; then
			userDir='/'
		fi
		userDir='/var/www/'
		rootDir=${directory:-$domain}
		## Check if Root Dir already exists
		if [ -e $userDir$rootDir ]; then
		echo -e $"✗ FAIL: This Root Dir already exists.\nPlease Try Another one" | tee -a "$log_file"
		exit;
		fi
		echo -e $"✓ SUCCESS: RootDir: $userDir$rootDir \n" | tee -a "$log_file"

		## Database config
		#TODO: Validation
		read -p "Enter your Database User [localground]: " dbowner
		USER=${dbowner:-localground}
		echo -e $"USER: $USER \n" | tee -a "$log_file"

		read -p "Enter your Database Password [random]: " dbpass
		DB_PASS=${dbpass:-$(openssl rand -hex 32)}
		echo -e $"DB_PASS: $DB_PASS \n" | tee -a "$log_file"

		read -p "Enter your Database Name [lg_test_database]: " dbname
		DB_NAME=${dbname:-lg_test_database}
		echo -e $"DB_NAME: $DB_NAME \n" | tee -a "$log_file"

		#sendgrid
		read -p "Enter your SENDGRID_API_KEY [sendgridapidefault]: " sendgridapi
		SENDGRID_API_KEY=${sendgridapi:-sendgridapidefault}
		echo -e $"SENDGRID_API_KEY: $SENDGRID_API_KEY \n" | tee -a "$log_file"

		#mapbox
		read -p "Enter your MAPBOX_API_KEY [mapboxapidefault]: " mapboxapi
		MAPBOX_API_KEY=${mapboxapi:-mapboxapidefault}
		echo -e $"MAPBOX_API_KEY: $MAPBOX_API_KEY \n" | tee -a "$log_file"

		#Google Oauth 2
		read -p "Enter your SOCIAL_AUTH_GOOGLE_OAUTH2_KEY [google_oauth]: " googleoauth
						SOCIAL_AUTH_GOOGLE_OAUTH2_KEY=${googleoauth:-google_oauth}
		echo -e $"SOCIAL_AUTH_GOOGLE_OAUTH2_KEY: $SOCIAL_AUTH_GOOGLE_OAUTH2_KEY \n" | tee -a "$log_file"

		#Google Oauth 2 Secret
		read -p "Enter your SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET [google_oauth_secret]: " googleoauthsecret
		SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET=${googleoauthsecret:-google_oauth_secret}
		echo -e $"SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET: $SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET \n" | tee -a "$log_file"

		#AWS Access
		read -p "Enter your AWS_ACCESS_KEY_ID [AWS_Access_ID]: " awsaccess
		AWS_ACCESS_KEY_ID=${awsaccess:-AWS_Access_ID}
		echo -e $"AWS_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID \n" | tee -a "$log_file"

		#AWS Secret
		read -p "Enter your AWS_SECRET_ACCESS_KEY [aws_secret_access_key_id]: " awssecretaccessid
		AWS_SECRET_ACCESS_KEY=${awssecretaccessid:-aws_secret_access_key_id}
		echo -e $"AWS_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY \n" | tee -a "$log_file"

		#AWS Bucket
		read -p "Enter your AWS_STORAGE_BUCKET_NAME [aws_storage_bucket]: " awsstoragebucket
		AWS_STORAGE_BUCKET_NAME=${awsstoragebucket:-aws_storage_bucket}
		echo -e $"AWS_STORAGE_BUCKET_NAME: $AWS_STORAGE_BUCKET_NAME \n" | tee -a "$log_file"
      	;;

	#############################################
	## INVALID FLAG                            ##
	#############################################
    \?)
      	echo "Invalid option: -$OPTARG" >&2
      	;;
  esac
done


##################################
##								##
#	  CREATE USER		 		 #
##								##
##################################
#
# This section creates the localground user
#

## Create Linux User
#TODO: Check to see if exists

echo "CONFIG: Create Linux user." | tee -a "$log_file"
	useradd -d /home/$USER $USER
	sudo mkdir /home/$USER
	sudo chown $USER:$USER /home/$USER
	if [ "$development" = false ] ; then
		sudo mkdir -p $userDir$rootDir
		sudo chown $USER:$GROUP_ACCOUNT $userDir$rootDir
	else
		## Make sym
		ln -s  /vagrant /localground
	fi
echo "✓ SUCCESS: Linux User '$USER' and dirs created" | tee -a "$log_file"


##################################
##								##
#	  INSTALL NGINX		 		 #
##								##
##################################
#
# This section installs the fast reverse proxy server NGINX.
#

echo -e $"? CHECK: NGINX binary"

## Check if nginx binary exists.
if [ ! -f /usr/sbin/nginx ]; then
    echo " "
    echo "NGINX not found, installing ..." | tee -a "$log_file"
	apt-get update
	apt install nginx -y
fi
    echo -e $"✓ SUCCESS: NGINX found! \n" | tee -a "$log_file"
    echo "Stopping nginx" | tee -a "$log_file"
	## Stop Nginx
	service nginx stop

##################################
##								##
#	 CONFIG Root Dir			 #
##								##
##################################
#
# This section checks if root dir exists and clones git repo of localground
#

echo -e $"CONFIG: Root Dir" | tee -a "$log_file"

if [ "$development" = false ] ; then
	## Check if directory exists or not
	if ! [ -d $userDir$rootDir ]; then
		### create the directory
		mkdir -p $userDir$rootDir
		### give permission to root dir
		chmod 755 $userDir$rootDir
		### Clone  in the new domain dir
	echo -e $"Cloning repository: $repository into $userDir$rootDir\n" | tee -a "$log_file"
		if ! git clone -b $gitbranch --single-branch "$repository" "$userDir$rootDir"
			then
				echo $"ERROR: Not able to write repository $userDir$rootDir Please check permissions." | tee -a "$log_file"
				exit;
		else
				echo $"✓ SUCCESS: Cloned repository: $userDir$rootDir" | tee -a "$log_file"
		fi
	fi
fi

##################################
##								##
#	  CONFIG SSL 	 			 #
##								##
##################################
#
# This section configures ssl snippet for nginx based on either dev environment or production
#
# NOTE:	Best practice: https://mozilla.github.io/server-side-tls/ssl-config-generator/
#
## TODO: Check Qualys SSL afterwards for privacy score. https://github.com/ssllabs/ssllabs-scan/
source "$FILE_PATH"config-ssl.sh

##################################
##								##
#	CONFIG Crontab	 			 #
##								##
##################################
#
# This section creates crontab for TLS renewal.
#
# Config: cron file "twice a day update"
# Best practice as of https://certbot.eff.org/all-instructions/
# 1am and 1pm everyday.


if [ "$development" = false ] ; then
	echo -e $"CONFIG: Crontab for automatic SSL renewal." | tee -a "$log_file"
	(crontab -l ; echo "00 01,13 * * * /usr/bin/certbot renew --no-self-upgrade --quiet") | crontab -
fi
	echo -e $"✓ SUCCESS: Crontab for automatic SSL renewal created! \n" | tee -a "$log_file"


##################################
##								##
#	  CONFIG NGINX				 #
##								##
##################################
#
# This section creates virtual host rules file.
#

source "$FILE_PATH"config-nginx.sh


##################################
##								##
#	CONFIG Ownership			 #
##								##
##################################
#
# This section sets the ownership of the project dir and enables website.
#

echo -e $"CONFIG: Ownership" | tee -a "$log_file"
## Check if owner is blank
if [ "$USER" == "" ]; then
	chown -R $USER:www-data $userDir$rootDir
else
	chown -R $USER:www-data $userDir$rootDir
fi
	##TODO: fix the need for this
ln -s  $userDir$rootDir localground

	## enable website
ln -s $sitesAvailable$domain $sitesEnabled$domain

	## Reload Nginx
service nginx reload

echo -e $"✓ SUCCESS: Ownership Configured! \n" | tee -a "$log_file"



##################################
##								##
#	Install Localground			 #
##								##
##################################

source "$FILE_PATH"install-localground.sh

##################################
##								##
#	Config & populate DB		 #
##								##
##################################
#
# This section creates DB, user and grant perms
#

source "$FILE_PATH"config-database.sh

##################################
##								##
#	  CONFIG LOCALGROUND		 #
##								##
##################################
#
# This section creates settings settings_local.py
#
## TODO: Config Amazon S3

source "$FILE_PATH"config-localground.sh

##################################
##								##
#	Populate Database			 #
##								##
##################################
#
# This section populates the DB & lookuptables
#

## Populate the db & lookuptables
echo "Populate the DB" | tee -a "$log_file"
	# sudo -u $USER bash -c "python $userDir'localground/apps/manage.py' makemigrations"
	sudo -u $USER bash -c "python $userDir'localground/apps/manage.py' migrate"
	sudo -u $USER bash -c "psql -c \"update django_site set domain = '$SERVER_HOST', name = '$SERVER_HOST';\" -d $DB_NAME"
	service postgresql restart
	#sudo -u $USER bash -c "python $userDir'localground/apps/manage.py' syncdb --noinput"
	sudo -u $USER bash -c "python $userDir'localground/apps/manage.py' test --verbosity=2"
echo -e $"✓ SUCCESS: Django Tables Created! \n" | tee -a "$log_file"

echo "Starting celery daemon" | tee -a "$log_file"
	service supervisor restart
	supervisorctl restart celery
echo -e $"✓ SUCCESS: celery Daemon restart! \n" | tee -a "$log_file"


###############################################
# Fix permissions on localground dir files    #
###############################################

chown -R $USER:$GROUP_ACCOUNT $userDir$rootDir

##################################
##								##
#	   Display Info				 #
##								##
##################################
#
# This section Shows Localground Variables
#

### show the finished message
echo " " | tee -a "$log_file"
echo "###########################################" | tee -a "$log_file"
echo "DOMAIN: $domain " | tee -a "$log_file"
echo "Email: $emailaddr " | tee -a "$log_file"
echo "RootDir: $userDir$rootDir " | tee -a "$log_file"
echo "USER: $USER	" | tee -a "$log_file"
echo "DB_PASS: $DB_PASS	" | tee -a "$log_file"
echo "DB_NAME: $DB_NAME	" | tee -a "$log_file"
echo "AWS_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID"| tee -a "$log_file"
echo "TLS Snippet: $sslsnippet " | tee -a "$log_file"
echo "SENDGRID_API_KEY: $SENDGRID_API_KEY" | tee -a "$log_file"
echo "MAPBOX_API_KEY: $MAPBOX_API_KEY" | tee -a "$log_file"
echo "SOCIAL_AUTH_GOOGLE_OAUTH2_KEY: $SOCIAL_AUTH_GOOGLE_OAUTH2_KEY " | tee -a "$log_file"
echo "SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET: $SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET " | tee -a "$log_file"
echo "AWS_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID " | tee -a "$log_file"
echo "AWS_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY " | tee -a "$log_file"
echo "AWS_STORAGE_BUCKET_NAME: $AWS_STORAGE_BUCKET_NAME	" | tee -a "$log_file"
echo "###########################################" | tee -a "$log_file"
echo " "
echo '------------------------------------' | tee -a "$log_file"
echo ' Server configured. Check it out at ' | tee -a "$log_file"
echo " https://$domain			  " | tee -a "$log_file"
echo ' Django: http://0.0.0.0:8000    ' | tee -a "$log_file"
echo " Files: $userDir$rootDir		  " | tee -a "$log_file"
echo '------------------------------------' | tee -a "$log_file"
echo -e $"✓ SUCCESS: Log file written to: $log_file. \n"
echo -e $"!!! -- PLEASE REMOVE logfile, it contains sensitive information -- !!! \n"

##################################
##								##
#	Run Django App				 #
##								##
##################################
#
# This section runs Django / Localground
#
echo -e $"✓ SUCCESS: Now Starting LocalGround! \n" | tee -a "$log_file"
service nginx restart

#TODO: move to socket & config uWSGI in emperor mode.
if [ "$development" = false ] ; then
	sudo -u $USER bash -c "python $userDir'localground/apps/manage.py' runserver 0.0.0.0:8000"
fi
