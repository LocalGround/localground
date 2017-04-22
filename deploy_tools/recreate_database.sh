##############################
# To Run:
# $ bash recreate_database.sh
##############################

cd /localground/apps
DB_OWNER="postgres"
DB_NAME="lg_test_database"
DB_PASSWORD="password"
CREATE_SQL="create database $DB_NAME;"
DROP_SQL="drop database $DB_NAME;"
psql -c "$DROP_SQL" -U postgres
psql -c "$CREATE_SQL" -U postgres
psql -c "CREATE EXTENSION postgis;" -U postgres -d $DB_NAME
psql -c "CREATE EXTENSION postgis_topology;" -U postgres -d $DB_NAME
psql -c "alter user postgres with encrypted password '$DB_PASSWORD';" -U postgres
python manage.py syncdb
