#!/bin/bash
#title          :setup.sh
#description    :LocalGround configuration and installation script
#author         :brian@newday.host
#date           :20171011
#version        :0.1.4
#usage          :./localground.sh
#notes          : make symlink
#bash_version   :4.3.48(1)-release
#============================================================================

#TODO: Create virtualenv?
#TODO: Put Django on uWSGI use a socket instead of a port, update nginx config.
#TODO: Config Firewall, sudo ufw allow 'Nginx Full' &&  ufw delete allow 'Nginx HTTP'
#if vagrant - don't pull repository from git
#
#create service that autostarts "python manage.py runserver 127.0.0.1:8000"
#
#
# cd /home/peppy/Documents/Business/Clients/UC Berk/localground vagrant up
# git commit -am "Config Vagrantfile to use root for setup.sh?"
# git push


##################################
##				##
#	      DEFAULTS		 #
##				##
##################################
#
# This section sets default paths and strings.
#

## Set defaults
log_file="$(pwd)/localground.log"
repository='https://github.com/LocalGround/localground.git'
gitbranch='nginx-config'
owner=$(whoami | awk '{print $1}')
sitesEnable='/etc/nginx/sites-enabled/'
sitesAvailable='/etc/nginx/sites-available/'
sslsnippet='/etc/nginx/snippets/ssl-localground.conf'

DJANGO_DEBUG=False
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
##				##
#	      CONFIG		 #
##				##
##################################
#
# This section asks some config questions and provides defaults.
#
## Dev environment or production?

while getopts ":dp" opt; do
  case $opt in
    d)
      echo "-d Development Env was triggered!" >&2
development=true
domain=localground
emailaddr=localgrounddev@mailinator.com
userDir='/'
rootDir=$domain

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

    p)
      echo "-p Production Env was triggered!" >&2
        domain=$(dig +short myip.opendns.com @resolver1.opendns.com).xip.io
        development=false

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
	userDir=''
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

## API Keys


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
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done
	

##################################
##				##
#	  CREATE USER		 #
##				##
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
	sudo mkdir -p $userDir$rootDir
	sudo chown $USER:$GROUP_ACCOUNT $userDir$rootDir
echo "✓ SUCCESS: Linux User '$USER' and dirs created" | tee -a "$log_file"


##################################
##				##
#	  INSTALL NGINX		 #
##				##
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
##				##
#	 CONFIG Root Dir	 #
##				##
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
##				##
#	  CONFIG SSL 	 	 #
##				##
##################################
#
# This section configures ssl snippet for nginx based on either dev environment or production
#
# NOTE:	Best practice: https://mozilla.github.io/server-side-tls/ssl-config-generator/
#
## TODO: Check Qualys SSL afterwards for privacy score. https://github.com/ssllabs/ssllabs-scan/

echo -e $"CONFIG: TLS Encryption." | tee -a "$log_file"

## Check if SSL snippets directory exists or not.
    echo -e $"CHECK: /etc/nginx/snippets/" | tee -a "$log_file"
if ! [ -d /etc/nginx/snippets/ ]; then
	### create the directory
	mkdir /etc/nginx/snippets/
	### give permission to snippets dir
	chmod 755 /etc/nginx/snippets/
fi
    echo -e $"✓ SUCCESS: Directory '/etc/nginx/snippets/' created! \n" | tee -a "$log_file"

## DEV = TRUE
# Generate SSL cert
# Set public .crt file, private .pem file, and dhparam file locations

if [ "$development" = true ] ; then
	## Generate weak Diffie-Helman key (for Perfect Forward Secrecy).
	echo -e $"CONFIG: Now Generating weak Diffie-Helman key." | tee -a "$log_file"
	/usr/bin/openssl dhparam -out /etc/ssl/certs/dhparam.pem 1024
	echo -e $"✓ SUCCESS: Installed Diffie-Helman key! \n" | tee -a "$log_file"

	## Self signed crt
	echo -e $"CONFIG: Now Generating weak Self Singed Cert." | tee -a "$log_file"
	/usr/bin/openssl req -x509 -newkey rsa:2048 -keyout /etc/ssl/certs/key.pem -out /etc/ssl/certs/cert.pem -days 365 -nodes -subj "/C=US/ST=California/L=Berkeley/O=Local Ground/OU=Org/CN=dev.localground.org"
	echo -e $"✓ SUCCESS: Installed Self Signed certificate! \n" | tee -a "$log_file"

	## Set locations to variables
	ssl_cert="/etc/ssl/certs/cert.pem"
	ssl_key="/etc/ssl/certs/key.pem"
	dhparam="/etc/ssl/certs/dhparam.pem"

	## Make sym
	ln -s  $userDir$rootDir /localground
fi

## DEV = False
# INSTALL certbot
# Obtain SSL cert
# Set public .crt file, private .pem file, and dhparam file locations

if [ "$development" = false ] ; then
	echo -e $"CONFIG: Now Installing Certbot." | tee -a "$log_file"
	apt-get install software-properties-common -y
	add-apt-repository ppa:certbot/certbot -y
	apt-get update
	apt-get install python-certbot-nginx -y
	echo -e $"✓ SUCCESS: Installed Certbot! \n" | tee -a "$log_file"

	## Generate strong Diffie-Helman key (for Perfect Forward Secrecy).
	echo -e $"CONFIG: Now Generating strong Diffie-Helman key." | tee -a "$log_file"
#	/usr/bin/openssl dhparam -out /etc/ssl/certs/dhparam.pem 4096
	echo -e $"✓ SUCCESS Installed Diffie-Helman key! \n" | tee -a "$log_file"

	## Generate TLS cert.
	echo -e $"CONFIG: Now installing Let's Encrypt TLS certificate." | tee -a "$log_file"
	certbot certonly --agree-tos --no-eff-email -m $emailaddr --standalone -d $domain || { echo 'cerbot failed' ; exit 1; }
	echo -e $"✓ SUCCESS: Installed Let's Encrypt TLS certificate! \n" | tee -a "$log_file"

	## Set locations to variables
	ssl_cert="/etc/letsencrypt/live/$domain/fullchain.pem"
	ssl_key="/etc/letsencrypt/live/$domain/privkey.pem"
	dhparam="/etc/ssl/certs/dhparam.pem"
fi

## Create TLS snippets
mkdir /etc/nginx/snippets/

echo -e $"CONFIG: TLS Snippet." | tee -a "$log_file"

if ! echo "## SSL Certs
    ssl_certificate $ssl_cert;
    ssl_certificate_key $ssl_key; # private key file

## SSL Config
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;
    ssl_dhparam $dhparam;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers 'ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:ECDHE-ECDSA-DES-CBC3-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA:!DSS';
    ssl_prefer_server_ciphers on;

## HSTS (ngx_http_headers_module is required) (15768000 seconds = 6 months)
    add_header Strict-Transport-Security max-age=15768000;

## OCSP Stapling
    # fetch OCSP records from URL in ssl_certificate and cache them
    ssl_stapling on;
    ssl_stapling_verify on;

    ## verify chain of trust of OCSP response using Root CA and Intermediate certs
    ssl_trusted_certificate $ssl_cert;

    resolver 8.8.8.8;
" > $sslsnippet
	then
		echo -e $"✗ FAIL: There is an ERROR creating $sslsnippet file. \n" | tee -a "$log_file"
		exit;
	else
		echo -e $"✓ SUCCESS: TLS Snippet file created! \n" | tee -a "$log_file"
	fi


##################################
##				##
#	CONFIG Crontab	 	 #
##				##
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
##				##
#	  CONFIG NGINX		 #
##				##
##################################
#
# This section creates virtual host rules file.
#

## Create NGINX Config

echo -e $"CONFIG: nginx" | tee -a "$log_file"

## remove default site
rm /etc/nginx/sites-enabled/default

## echo config to file
	if ! echo "## DJANGO Upstream
upstream django {
	server 127.0.0.1:8000;			# for a web port socket
	# run: python $userDir$rootDir/apps/manage.py runserver 127.0.0.1:8000
        }

server {
## Listen on IPv4 and IPv6
    listen 80 default_server;
    listen [::]:80 default_server;

## Redirect all HTTP requests to HTTPS with a 301 Moved Permanently response.
    return 301 https://\$host\$request_uri;
}

server {
## Listen on IPv4 and IPv6
    listen 443 ssl http2 default_server;
    listen [::]:443 ssl http2 default_server;

## Logs
    access_log   /var/log/nginx/$domain.access.log;
    error_log    /var/log/nginx/$domain.error.log;

## SSL Options
include $sslsnippet;

## Upload Options
   client_max_body_size 1024m;
   client_body_timeout 480s;

## Serve the Django Application website
    root    $userDir$rootDir;

## Django UserData
    location /userdata  {
	alias $userDir$rootDir/userdata;	# your Django project's media files
    }

## Django static files
    location /static {
	alias $userDir$rootDir/static;		# your Django project's static files
    }

## Finally, Set headers and send all non-media requests to the Django server.
    location / {
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header Host \$http_host;
        proxy_redirect off;
        proxy_set_header X-Forwarded-Proto \$scheme;

	proxy_pass      http://django/;
	include         uwsgi_params;
        }
}" > $sitesAvailable$domain

	then
		echo -e $"✗ FAIL: Could not create Virtual Host file '$domain' \n" | tee -a "$log_file"
		exit;
	else
		echo -e $"✓ SUCCESS: Virtual Host file '$domain' created! \n" | tee -a "$log_file"
fi

## Add domain in /etc/hosts
if ! echo "127.0.0.1	$domain" >> /etc/hosts
	then
		echo -e $"✗ FAIL: Not able to write '/etc/hosts' file. \n" | tee -a "$log_file"
		exit;
else
	echo -e $"✓ SUCCESS: Host added to '/etc/hosts' file! \n" | tee -a "$log_file"
fi


##################################
##				##
#	CONFIG Ownership	 #
##				##
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
ln -s  $userDir$rootDir /var/www/localground

	## enable website
ln -s $sitesAvailable$domain $sitesEnable$domain

	## Reload Nginx
service nginx reload

echo -e $"✓ SUCCESS: Ownership Configured! \n" | tee -a "$log_file"



##################################
##				##
#	Install Localground	 #
##				##
##################################
echo -e $"INSTALL: Localground Dependencies" | tee -a "$log_file"

###################################
# Install Mail			 #
###################################
apt-get install sendmail -y
apt-get install libmail-sendmail-perl -y
## add use TLS for mail
echo "include('/etc/mail/tls/starttls.m4')dnl" >> /etc/mail/sendmail.mc

################
# Install Java #
################
sudo apt-add-repository -y ppa:openjdk-r/ppa
sudo apt-get update
sudo apt-get -y install openjdk-7-jre

#######################################
# Install GDAL, MapServer, Etc. First #
#######################################
apt-get install python-software-properties -y 
apt-get install mapserver-bin -y 
apt-get install gdal-bin -y 
apt-get install cgi-mapserver-y
apt-get install python-gdal -y
apt-get install python-mapscript -y

###############################################
# Add the google projection to the proj4 file #
###############################################
PROJ_FILE=/usr/share/proj/epsg
printf '\n#Google Projection\n<900913> +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs\n' | tee -a $PROJ_FILE

###########################################
# Then Install PostgreSQL9.5, PostGIS 9.5 #
###########################################
apt-get install postgresql-9.5 -y 
apt-get install postgresql-client-9.5 -y 
apt-get install postgresql-server-dev-9.5 -y 
apt-get install postgresql-plperl-9.5 -y 
apt-get install postgresql-9.5-postgis-2.2 -y 
apt-get install postgresql-9.5-postgis-scripts -y 
apt-get install libpq-dev -y

########################################################################
# Install Graphics, Miscellaneous Stuff...
######################################################################## -y 
apt-get install python-gdal -y 
apt-get install libcv-dev libopencv-dev python-opencv -y 
apt-get install python-psycopg2 -y 
apt-get install python-setuptools -y
apt-get install -y software-properties-common
apt-add-repository -y universe
apt-get update
apt-get install -y python-pip
apt-get install python-dev -y
apt-get install python-mapscript -y
apt-get install python-scipy -y
## Ubuntu Xenial doesn't have an ffmpeg package (only libav)
apt-add-repository -y ppa:jonathonf/ffmpeg-3
apt-get update -y
apt-get install ffmpeg -y
apt-get install redis-server -y

#################
# SVG Libraries #
#################
apt-get -y install python-cffi
apt-get -y install libffi-dev

############################
# Install PIP Dependencies #
############################
##TODO: Investigate, there may be some problems with the map script / map server install
pip install -r $userDir$rootDir/deploy_tools/requirements.txt

## Due to difficulties installing cairo via requirements.txt, I'm
## Installing it the manual way...
pip uninstall cffi
pip install cffi==1.10.0
pip install cairocffi==0.8.0
pip install cairosvg==1.0.22

#############################
# Install Node.js and Bower #
#############################
#curl -sL https://deb.nodesource.com/setup | sudo bash -
apt-get install nodejs -y
apt-get install npm -y
npm install -g grunt-cli
ln -s /usr/bin/nodejs /usr/bin/node

###############################
# Create required directories #
###############################
#TODO: remove, AWS S3
mkdir -p $userDir$rootDir/userdata/media
mkdir -p $userDir$rootDir/userdata/prints
mkdir -p $userDir$rootDir/userdata/deleted

#TODO: remove, cause nginx fixes.
## -> Avoiding the issue w/serving django contrib static files vs. Apache's alias
#	cp -r /usr/local/lib/python2.7/dist-packages/swampdragon/static/swampdragon $userDir$rootDir/static/swampdragon
#################
# Install Redis #
#################
apt-get -y install redis-server rabbitmq-server

## We use supervisor to run our celery worker
apt-get -y install supervisor
cp $userDir$rootDir/deploy_tools/celeryd.conf /etc/supervisor/conf.d/celeryd.conf
mkdir /var/log/celery

## Flower will monitor Celery
cp $userDir$rootDir/deploy_tools/flower.conf /etc/supervisor/conf.d/flower.conf

echo -e $"✓ SUCCESS: Dependencies Installed! \n" | tee -a "$log_file"
##################################
##				##
#	Config & populate DB	 #
##				##
##################################
#
# This section creates DB, user and grant perms
#

## Create DB, user and grant perms
echo -e $"Create Database: $DB_NAME " | tee -a "$log_file"
	sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"

echo -e $"Create User: $USER with Password: $DB_PASS" | tee -a "$log_file"
	sudo -u postgres bash -c "psql -c \"CREATE USER $USER WITH PASSWORD '$DB_PASS';\""

echo -e $"Grant Database Permissions to $DB_NAME" | tee -a "$log_file"
	sudo -u postgres psql -c "GRANT ALL ON DATABASE $DB_NAME TO $USER;"

echo -e $"✓ SUCCESS: Database created and user added! \n" | tee -a "$log_file"

## Alter DB to Django recommendations
echo "Alter DB to Django recommendations" | tee -a "$log_file"
	sudo -u postgres psql -c "ALTER ROLE $USER SET client_encoding TO 'utf8';"
	sudo -u postgres psql -c "ALTER ROLE $USER SET default_transaction_isolation TO 'read committed';"
	sudo -u postgres psql -c "ALTER ROLE $USER SET timezone TO 'UTC';"
## Alter Role for POSTGIS
	sudo -u postgres bash -c "psql -c \"ALTER ROLE $USER SUPERUSER;\""

	echo -e $"✓ SUCCESS: Database Altered! \n" | tee -a "$log_file"

	echo "Restart PostgreSQL" | tee -a "$log_file"
	service postgresql restart
	echo -e $"✓ SUCCESS: Database Restarted! \n" | tee -a "$log_file"

## Create PostGIS Extension
	echo "CONFIG: Create .pgpass File" | tee -a "$log_file"
		if ! echo "127.0.0.1:5432:$DB_NAME:$USER:$DB_PASS" > /home/$USER/.pgpass
	then
		echo -e $"✗ FAIL: There is an ERROR creating /home/$USER/.pgpass file. \n" | tee -a "$log_file"
		exit;
	else
		echo -e $"✓ SUCCESS: New .pgpass file Created! \n" | tee -a "$log_file"
	fi

## Set Permission
	chown $USER:$USER /home/$USER/.pgpass
	chmod 0600 /home/$USER/.pgpass

## Create PostGIS Extension
echo "Create PostGIS Extension" | tee -a "$log_file"
	sudo -u $USER bash -c "psql -c \"CREATE EXTENSION postgis;\" -d $DB_NAME"
	sudo -u $USER bash -c "psql -c \"CREATE EXTENSION postgis_topology;\" -d $DB_NAME"

## Restart postgresql
	service postgresql restart
	echo -e $"✓ SUCCESS: Database Extension Added! \n" | tee -a "$log_file"

echo -e $"CONFIG: BEGIN Localground MAIN CONFIG." | tee -a "$log_file"

##################################
##				##
#	  CONFIG LOCALGROUND	 #
##				##
##################################
#
# This section creates settings settings_local.py
#
## TODO: Config Amazon S3


## echo settings_local.py
	if ! echo "from localground.apps.settings import *

DEBUG = $DJANGO_DEBUG
TEMPLATE_DEBUG = DEBUG
GDAL_LIBRARY_PATH='$GDAL_LIBRARY_PATH'

ADMINS = (
    ('Admin', '$emailaddr'),
)

DEFAULT_FROM_EMAIL = '$emailaddr'
ADMIN_EMAILS = ['$emailaddr',]

# Custom Local Variables
# uses for internal links (server_url)
SERVER_HOST = '$domain'
PROTOCOL = 'https'
SERVER_URL = '%s://%s' % (PROTOCOL, SERVER_HOST)

# API Keys
SENDGRID_API_KEY = '$SENDGRID_API_KEY'
MAPBOX_API_KEY = '$MAPBOX_API_KEY'
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = '$SOCIAL_AUTH_GOOGLE_OAUTH2_KEY'
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = '$SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET'

# Amazon S3 keys
#AWS_ACCESS_KEY_ID = "$AWS_ACCESS_KEY_ID"
#AWS_SECRET_ACCESS_KEY = "$AWS_SECRET_ACCESS_KEY"
#AWS_STORAGE_BUCKET_NAME = "$AWS_STORAGE_BUCKET_NAME"
#AWS_QUERYSTRING_AUTH = False
#AWS_S3_CUSTOM_DOMAIN = AWS_STORAGE_BUCKET_NAME + ".s3.amazonaws.com"

#STATICFILES_LOCATION = 'static'
#MEDIAFILES_LOCATION = 'media'
#STATICFILES_STORAGE = 'myproject.custom_storages.StaticStorage'
#DEFAULT_FILE_STORAGE = 'myproject.custom_storages.MediaStorage'

# Django app runs behind a reverse proxy.
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
ALLOWED_HOSTS = ['*'] #TODO: CHECK
REGISTRATION_OPEN = $REGISTRATION_OPEN

# Absolute path to the directory root of the local ground instance:
FILE_ROOT = '/var/www/localground'
STATIC_ROOT = '%s/%s' % (FILE_ROOT, STATIC_MEDIA_DIR)
APPS_ROOT = '%s/apps' % FILE_ROOT
USER_MEDIA_ROOT = '%s/%s' % (FILE_ROOT, USER_MEDIA_DIR)
FONT_ROOT = '%s/css/fonts/' % STATIC_ROOT
TEMP_DIR = '%s/tmp/' % FILE_ROOT
QR_READER_PATH = '%s/lib/barcodereader' % APPS_ROOT

MAP_FILE = FILE_ROOT + '/mapserver/localground.map'
#TAGGING_AUTOCOMPLETE_JS_BASE_URL = '/%s/scripts/jquery-autocomplete' % STATIC_MEDIA_DIR

# OS variables:
USER_ACCOUNT = '$USER'		#account to use for creating new OS files / directories
GROUP_ACCOUNT = '$GROUP_ACCOUNT'	#group to use for creating new OS files / directories

# Database Config
HOST = '127.0.0.1'		        #Your Database Host
PORT = '5432'				#Your Database Port
USERNAME = '$USER'			#Your Database Username
PASSWORD = '$DB_PASS'		        #Your Database Password
DATABASE = '$DB_NAME'	        	#Your Database Name

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis', #Code works w/PostGIS
        'NAME': DATABASE,
        'USER': USERNAME,
        'PASSWORD': PASSWORD,
        'HOST': HOST,
        'PORT': PORT,
    }
}

TEMPLATE_DIRS = (
    '%s/templates' % APPS_ROOT,
)

#Turns on Django Debugging
'''
INSTALLED_APPS += ('debug_toolbar',)
INTERNAL_IPS = ('127.0.0.1', '10.0.2.2') #note the 10.0.2.2 is the IP for Vagrant connections
MIDDLEWARE_CLASSES += ('debug_toolbar.middleware.DebugToolbarMiddleware',)
'''
" > $userDir$rootDir/apps/settings_local.py
then
		echo -e $"✗ FAIL: There is an ERROR creating $userDir$rootDir/apps/settings_local.py file. \n" | tee -a "$log_file"
		exit;
	else
		echo -e $"✓ SUCCESS: New settings_local.py file Created! \n" | tee -a "$log_file"
fi

##################################
##				##
#	Populate Database	 #
##				##
##################################
#
# This section populates the DB & lookuptables
#

## Populate the db & lookuptables
echo "Populate the DB" | tee -a "$log_file"
	sudo -u $USER bash -c "python /var/www/localground/apps/manage.py makemigrations"
	sudo -u $USER bash -c "python /var/www/localground/apps/manage.py migrate"
	service postgresql restart
echo -e $"✓ SUCCESS: Database populated! \n" | tee -a "$log_file"

###############################################
# Create required Django tables and run tests #
###############################################

echo -e $"CONFIG: Create required Django tables." | tee -a "$log_file"
	sudo -u $USER bash -c "python /var/www/localground/apps/manage.py syncdb --noinput"
	sudo -u $USER bash -c "python /var/www/localground/apps/manage.py test --verbosity=2"
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
##				##
#	Show Info		 #
##				##
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
echo ' Django: http://localhost:8000      ' | tee -a "$log_file"
echo " Files: $userDir$rootDir		  " | tee -a "$log_file"
echo '------------------------------------' | tee -a "$log_file"
echo -e $"✓ SUCCESS: Log file written to: $log_file. \n"
echo -e $"!!! -- PLEASE REMOVE logfile, it contains sensitive information -- !!! \n"

##################################
##				##
#	Run Django App		 #
##				##
##################################
#
# This section runs Django / Localground
#
echo -e $"✓ SUCCESS: Now Starting LocalGround! \n" | tee -a "$log_file"
service nginx restart

#TODO: move to socket & config uWSGI in emperor mode.
sudo -u $USER bash -c "python /var/www/localground/apps/manage.py runserver 127.0.0.1:8000"
