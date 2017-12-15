##############################
# To Run:
# $ bash recreate_database.sh
##############################

cd /localground/apps
DB_OWNER="localground"
DB_NAME="lg_test_database"
sudo -u postgres psql -c "DROP DATABASE $DB_NAME;"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
sudo -u postgres psql -c "GRANT ALL ON DATABASE $DB_NAME TO $DB_OWNER;"

#psql -c "CREATE EXTENSION postgis;" -U postgres -d $DB_NAME
#psql -c "CREATE EXTENSION postgis_topology;" -U postgres -d $DB_OWNER
#psql -c "alter user postgres with encrypted password '$DB_PASSWORD';" -U postgres
python manage.py syncdb
