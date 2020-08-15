#!/bin/bash

##################################
##				                ##
#	Install Localground	        #
##				                ##
##################################

echo -e $"INSTALL: Localground Dependencies" | tee -a "$log_file"

###################################
# Install Mail			          #
###################################
apt install sendmail -y
apt install libmail-sendmail-perl -y
## add use TLS for mail
echo "include('/etc/mail/tls/starttls.m4')dnl" >> /etc/mail/sendmail.mc

################
# Install Java #
################
sudo apt install openjdk-8-jdk

#######################################
# Install GDAL, MapServer, Etc. First #
#######################################
# apt install python-software-properties -y
apt install mapserver-bin -y
apt install gdal-bin -y
apt install cgi-mapserver -y
apt install python3-gdal -y
apt install python3-mapscript -y

###############################################
# Add the google projection to the proj4 file #
###############################################
PROJ_FILE=/usr/share/proj/epsg
printf '\n#Google Projection\n<900913> +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs\n' | tee -a $PROJ_FILE

###########################################
# Then Install PostgreSQL9.5, PostGIS 9.5 #
###########################################
# https://computingforgeeks.com/how-to-install-postgis-on-ubuntu-debian/
# sudo apt -y install gnupg2
# wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
# echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list
# wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
# echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list
# sudo apt update
# sudo apt -y install postgresql-12 postgresql-client-12
# sudo apt -y install postgis postgresql-12-postgis-3

# Note: don't forget to create POSTGIS Extension from psql prompt.
# CREATE EXTENSION postgis;

########################################################################
# Install Graphics, Miscellaneous Stuff...
######################################################################## -y
apt install gdal-bin -y
# apt install libcv-dev libopencv-dev python-opencv -y
apt install python3-opencv -y
# apt install python-psycopg2 -y
apt install python3-setuptools -y
apt install -y software-properties-common
apt-add-repository -y universe
apt update
apt install -y python3-pip
apt install python3-dev -y
apt install libpq-dev -y
apt install python3-mapscript -y
apt install python3-scipy -y
## Ubuntu Xenial doesn't have an ffmpeg package (only libav)
apt-add-repository -y ppa:jonathonf/ffmpeg-3
apt update -y
apt install ffmpeg -y
apt install redis-server -y

#################
# SVG Libraries #
#################
apt -y install python3-cffi
apt -y install libffi-dev

############################
# Install PIP Dependencies #
############################
# Configure Locales:
export LC_ALL="en_US.UTF-8"
export LC_CTYPE="en_US.UTF-8"
# sudo dpkg-reconfigure locales

##TODO: Investigate, there may be some problems with the map script / map server install
pip3 install -r $userDir$rootDir/deploy_tools/requirements.txt

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
apt install nodejs -y
apt install npm -y
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
apt -y install redis-server rabbitmq-server

## We use supervisor to run our celery worker
apt -y install supervisor
cp $userDir$rootDir/deploy_tools/celeryd.conf /etc/supervisor/conf.d/celeryd.conf
mkdir /var/log/celery

## Flower will monitor Celery
cp $userDir$rootDir/deploy_tools/flower.conf /etc/supervisor/conf.d/flower.conf

echo -e $"✓ SUCCESS: Dependencies Installed! \n" | tee -a "$log_file"
