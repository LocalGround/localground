#!/bin/bash -ex



# if you are building a server as oposed to a vagrant box, pass 'server' as the first argument to this script.
if [ "$1" == "server" ]; then
  SERVER=true
  APP_INSTALL_DIR=/var/www/localground
else
  SERVER=false
  APP_INSTALL_DIR=/localground
fi

sudo apt-get update
############################
# Install Useful Utilities #
############################
sudo apt-get install -y git curl vim

###################################
# Install Apache-Related Packages #
###################################
echo "Y" | sudo apt-get install apache2
echo "Y" | sudo apt-get install libapache2-mod-fcgid
echo "Y" | sudo apt-get install libapache2-mod-xsendfile
echo "Y" | sudo apt-get install libapache2-mod-wsgi
echo "Y" | sudo apt-get install sendmail
echo "Y" | sudo apt-get install libmail-sendmail-perl

################
# Install Java #
################
sudo apt-get -y install openjdk-7-jre

#######################################
# Install GDAL, MapServer, Etc. First #
#######################################
echo "Y" | sudo apt-get install python-software-properties
echo "Y" | sudo apt-get install mapserver-bin
echo "Y" | sudo apt-get install gdal-bin
echo "Y" | sudo apt-get install cgi-mapserver
echo "Y" | sudo apt-get install python-gdal
echo "Y" | sudo apt-get install python-mapscript
	
###############################################
# Add the google projection to the proj4 file #
###############################################
PROJ_FILE=/usr/share/proj/epsg
sudo printf '\n#Google Projection\n<900913> +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs\n' | sudo tee -a $PROJ_FILE

###########################################
# Then Install PostgreSQL9.1, PostGIS 9.1 #
###########################################
echo "Y" | sudo apt-get install postgresql-9.3
echo "Y" | sudo apt-get install postgresql-client-9.3
echo "Y" | sudo apt-get install postgresql-server-dev-9.3
echo "Y" | sudo apt-get install postgresql-plperl-9.3
echo "Y" | sudo apt-get install postgresql-9.3-postgis-2.1
echo "Y" | sudo apt-get install postgresql-9.3-postgis-scripts
echo "Y" | sudo apt-get install libpq-dev

##################################
# Configure PostgreSQL / PostGIS #
##################################
# Doing some automatic config file manipulations for postgres / postgis:
if $SERVER; then
  DB_NAME='lg_prod'
  DB_OWNER='localground'
  DB_PASSWORD=$(openssl rand -base64 32)
else
  DB_NAME="lg_test_database"
  DB_OWNER="postgres"
  DB_PASSWORD="password"
fi
PG_VERSION=9.3
PG_HBA="/etc/postgresql/$PG_VERSION/main/pg_hba.conf"
PEER="local   all             postgres                                peer"
TRUST="local   all             postgres                                trust"
MD5="local   all             postgres                                md5"
sudo sed -i "s/$PEER/$TRUST/g" $PG_HBA
sudo sed -i "s/$MD5/$TRUST/g" $PG_HBA
sudo service postgresql restart
CREATE_SQL="create database $DB_NAME;"
psql -c "$CREATE_SQL" -U postgres
psql -c "CREATE EXTENSION postgis;" -U postgres -d $DB_NAME
psql -c "CREATE EXTENSION postgis_topology;" -U postgres -d $DB_NAME

if $SERVER; then
  psql -c "CREATE USER $DB_OWNER WITH PASSWORD '$DB_PASSWORD';" -U postgres
  psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME to $DB_OWNER;" -U postgres
  psql -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_OWNER;" -U postgres
  psql -c "GRANT ALL ON ALL SEQUENCES IN SCHEMA public to $DB_OWNER;" -U postgres
  psql -c "GRANT ALL ON ALL FUNCTIONS IN SCHEMA public to $DB_OWNER;" -U postgres
else
  psql -c "alter user $DB_OWNER with encrypted password '$DB_PASSWORD';" -U postgres
fi

sudo sed -i "s/$TRUST/$MD5/g" $PG_HBA
sudo service postgresql restart

########################################################################
# Install Graphics, Miscellaneous Stuff...
########################################################################
echo "Y" | sudo apt-get install python-gdal
echo "Y" | sudo apt-get install libcv-dev libopencv-dev python-opencv
echo "Y" | sudo apt-get install python-psycopg2
echo "Y" | sudo apt-get install python-setuptools
# sudo apt-get install -y python-pip=1.5.4-1ubuntu3 #try a different version of pip?
sudo apt-get install -y software-properties-common
sudo apt-add-repository universe
sudo apt-get update
sudo apt-get install -y python-pip
# sudo easy_install -U pip
echo "Y" | sudo apt-get install python-dev
echo "Y" | sudo apt-get install python-mapscript
echo "Y" | sudo apt-get install python-scipy
sudo add-apt-repository -y ppa:mc3man/trusty-media #trusty ubuntu doesn't have an ffmpeg package (only libav)
sudo apt-get update
echo "Y" | sudo apt-get install ffmpeg
#echo "Y" | sudo apt-get install libavcodec-extra-53
echo "Y" | sudo apt-get install redis-server

#################
# SVG Libraries #
#################
sudo apt-get -y install python-cffi
sudo apt-get -y install libffi-dev

############################
# Install PIP Dependencies #
############################
# there may be some problems with the map script / map server install
if $SERVER; then
  sudo pip install -r ./requirements.txt
  sudo mkdir $APP_INSTALL_DIR
  adduser deployer  
  sudo chown -R deployer:deployer $APP_INSTALL_DIR
  cd $APP_INSTALL_DIR/..
  sudo -u deployer git clone https://github.com/LocalGround/localground.git
  sudo chown -R www-data:deployer $APP_INSTALL_DIR
else
  sudo ln -s /vagrant $APP_INSTALL_DIR
  sudo pip install -r /vagrant/deploy_tools/requirements.txt
fi

# Due to difficulties installing cairo via requirements.txt, I'm
# Installing it the manual way...
sudo pip uninstall cffi
sudo pip install cffi==1.10.0
sudo pip install cairocffi==0.8.0
sudo pip install cairosvg==1.0.22

#############################
# Install Node.js and Bower #
#############################
#curl -sL https://deb.nodesource.com/setup | sudo bash -
#echo "Y" | sudo apt-get install nodejs
#echo "Y" | sudo apt-get install npm
#echo "Y" | sudo npm install -g bower

####################################
# Configure Local Ground on Apache #
####################################
sudo a2enmod proxy_http
sudo a2enmod ssl
if $SERVER; then
  sudo cp $APP_INSTALL_DIR/deploy_tools/apache_server_config /etc/apache2/sites-available/localground.conf
  sudo ln -s /etc/apache2/sites-available/localground.conf /etc/apache2/sites-enabled/localground.conf
  sudo cp $APP_INSTALL_DIR/deploy_tools/settings_local.py $APP_INSTALL_DIR/apps/.
else
  sudo cp /localground/deploy_tools/apache_vagrant_config /etc/apache2/sites-available/localground.conf
  sudo ln -s /etc/apache2/sites-available/localground.conf /etc/apache2/sites-enabled/localground.conf
  sudo cp /localground/deploy_tools/settings_local.py /localground/apps/.
fi
sudo rm /etc/apache2/sites-enabled/000-default.conf 
sudo service apache2 restart

###############################
# Create required directories #
###############################
cd $APP_INSTALL_DIR
mkdir -p userdata/media
mkdir -p userdata/prints
mkdir -p userdata/deleted
#Avoiding the issue w/serving django contrib static files vs. Apache's alias
sudo cp -r /usr/local/lib/python2.7/dist-packages/swampdragon/static/swampdragon $APP_INSTALL_DIR/static/swampdragon
#################
# Install Redis #
#################
sudo apt-get -y install redis-server rabbitmq-server

# we use supervisor to run our celery worker 
sudo apt-get -y install supervisor
sudo cp $APP_INSTALL_DIR/deploy_tools/celeryd.conf /etc/supervisor/conf.d/celeryd.conf
sudo mkdir /var/log/celery

# flower will monitor celery
sudo cp $APP_INSTALL_DIR/deploy_tools/flower.conf /etc/supervisor/conf.d/flower.conf


###############################################
# Create required Django tables and run tests #
###############################################
cd $APP_INSTALL_DIR/apps
sudo ln -s /usr/lib/libgdal.so.1.17.1 /usr/lib/libgdal.so.1.17.0
python manage.py syncdb --noinput
python manage.py test --verbosity=2
sudo service supervisor restart
sudo supervisorctl restart celery

if $SERVER; then
  echo "db Username is $DB_OWNER with password '$DB_PASSWORD'"
else
  echo '------------------------------------'
  echo ' Server configured. Check it out at '
  echo ' http://localhost:7777              '
  echo '------------------------------------'
fi
