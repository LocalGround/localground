#!/bin/bash

##################################
##				                ##
#	Config & populate DB	     #
##				                ##
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
	sudo -u $USER bash -c "psql -d template1 -c \"create extension hstore;\""
	sudo -u $USER bash -c "psql -c \"CREATE EXTENSION hstore;\" -d $DB_NAME"

## Restart postgresql
	service postgresql restart
	echo -e $"✓ SUCCESS: Database Extension Added! \n" | tee -a "$log_file"

echo -e $"CONFIG: BEGIN Localground MAIN CONFIG." | tee -a "$log_file"
