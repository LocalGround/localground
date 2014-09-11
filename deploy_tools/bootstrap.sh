#!/usr/bin/env bash

sudo apt-get update
###################################################################
# Install Useful Utilities
###################################################################
echo "Y" | sudo apt-get install vim
echo "Y" | sudo apt-get install curl
echo "Y" | sudo apt-get install git

###################################################################
# Install Apache-Related Packages
###################################################################
echo "Y" | sudo apt-get install apache2
echo "Y" | sudo apt-get install libapache2-mod-fcgid
echo "Y" | sudo apt-get install libapache2-mod-xsendfile
echo "Y" | sudo apt-get install libapache2-mod-wsgi
echo "Y" | sudo apt-get install sendmail
echo "Y" | sudo apt-get install libmail-sendmail-perl

###################################################################
# Install GDAL, MapServer, Etc. First
###################################################################
echo "Y" | sudo apt-get install python-software-properties
echo "Y" | sudo add-apt-repository ppa:ubuntugis/ppa
sudo apt-get update
echo "Y" | sudo apt-get install mapserver-bin
echo "Y" | sudo apt-get install gdal-bin
echo "Y" | sudo apt-get install cgi-mapserver
echo "Y" | sudo apt-get install python-gdal
echo "Y" | sudo apt-get install python-mapscript

###################################################################
# Add the google projection to the proj4 file:
###################################################################
PROJ_FILE=/usr/share/proj/epsg
sudo printf '\n#Google Projection\n<900913> +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs\n' | sudo tee -a $PROJ_FILE

###################################################################
# Then Install PostgreSQL9.1, PostGIS 9.1
###################################################################
echo "Y" | sudo apt-get install postgresql-9.1
echo "Y" | sudo apt-get install postgresql-client-9.1
echo "Y" | sudo apt-get install postgresql-server-dev-9.1
echo "Y" | sudo apt-get install postgresql-plperl-9.1
echo "Y" | sudo apt-get install postgresql-9.1-postgis-2.0

# Doing some automatic config file manipulations for postgres / postgis:
DB_OWNER="postgres"
DB_NAME="lg_test_database"
DB_PASSWORD="my_password"
PG_VERSION=9.1
PG_HBA="/etc/postgresql/$PG_VERSION/main/pg_hba.conf"
PEER="local   all             postgres                                peer"
TRUST="local   all             postgres                                trust"
MD5="local   all             postgres                                md5"
sudo sed -i "s/$PEER/$TRUST/g" $PG_HBA                               md5"
sudo sed -i "s/$MD5/$TRUST/g" $PG_HBA
sudo service postgresql restart
CREATE_SQL="create database $DB_NAME;"
psql -c "$CREATE_SQL" -U postgres
psql -c "CREATE EXTENSION postgis;" -U postgres -d $DB_NAME
psql -c "CREATE EXTENSION postgis_topology;" -U postgres -d $DB_NAME
psql -c "alter user postgres with encrypted password '$DB_PASSWORD';" -U postgres
sudo sed -i "s/$TRUST/$MD5/g" $PG_HBA
sudo service postgresql restart

########################################################################
# Install Graphics, Miscellaneous Stuff...
########################################################################
echo "Y" | sudo apt-get install python-gdal
echo "Y" | sudo apt-get install libcv2.3 libopencv-dev python-opencv
echo "Y" | sudo apt-get install python-psycopg2
echo "Y" | sudo apt-get install python-pip python-dev
echo "Y" | sudo apt-get install python-mapscript
echo "Y" | sudo apt-get install python-scipy
echo "Y" | sudo apt-get install ffmpeg
echo "Y" | sudo apt-get install libavcodec-extra-53


############################
# Install PIP Dependencies #
############################
# there may be some problems with the map script / map server install
sudo ln -s /vagrant /localground
sudo pip install -r /vagrant/deploy_tools/requirements.txt
sudo pip install PIL==1.1.7

#############################
# Install Node.js and Bower #
#############################
curl -sL https://deb.nodesource.com/setup | sudo bash -
echo "Y" | sudo apt-get install nodejs
echo "Y" | sudo npm install -g bower

#################################################
# Configure Local Ground on Apache with Vagrant #
#################################################
sudo cp /localground/deploy_tools/apache_localground_config /etc/apache2/sites-available/localground
sudo ln -s /etc/apache2/sites-available/localground /etc/apache2/sites-enabled/localground
sudo cp /localground/deploy_tools/settings_local.py /localground/apps/.
sudo service apache2 restart

cd /localground/apps
python manage.py syncdb --noinput
python manage.py test site --verbosity=2

echo '-----------------------------------'
echo 'Server configured. Check it out at '
echo 'http://localground:7777 Make sure  '
echo 'that you edit your hosts file.     '
echo '-----------------------------------'


