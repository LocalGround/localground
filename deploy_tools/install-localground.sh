#!/bin/bash

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
# Configure Locales:
export LC_ALL="en_US.UTF-8"
export LC_CTYPE="en_US.UTF-8"
sudo dpkg-reconfigure locales

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
