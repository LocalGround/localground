#!/bin/bash -ex

adduser deployer
# it doesn't matter what the password is.

adduser scot
usermod -aG sudo scot
#add any other users that need sudo

chown www-data:deployer /localground/*

# copy over server apache config file

# setup db with psql
create database lg_prod;
CREATE USER localground WITH PASSWORD 'some_password';
GRANT ALL PRIVILEGES ON DATABASE lg_dev to localground;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO localground;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public to localground;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public to localground;

# run iptables rules
