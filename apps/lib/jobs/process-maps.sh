#!/bin/bash

# the working directory is passed as an argument from the cron job
cd $1 #/usr/local/django/dev/localground/jobs
python process-maps.py

