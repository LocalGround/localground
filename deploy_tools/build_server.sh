# These are some commands that you might need to run to get things setup properly

# the bootstrap.sh will do most things properly, but will probably fail and you will need to do some manual steps.

# 1) if the script fails you will not see the db password printed out, so you'll need to search for psql in the output to find the password.
# 2) once you know the password, you'll need to modify settings_local.py and change the db parameters.
# 3) most likely you'll need to modify the apache config.
# 4) update security stuff.  sshd_config don't allow passwords or root login.  run iptables file in repo. 

adduser scot
usermod -aG sudo scot
#add any other users that need sudo



# setup db with psql, this is done in bootstrap.sh now.
create database lg_prod;
CREATE USER localground WITH PASSWORD 'some_password';
GRANT ALL PRIVILEGES ON DATABASE lg_dev to localground;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO localground;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public to localground;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public to localground;

