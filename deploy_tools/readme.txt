This file will ultimately contain instructions on how to configure your machine
so that it runs Local Ground without a hitch -- at least using Ubuntu 12.04.2.
This is a work in progress...stay tuned.


=====================
Install Linux Modules
=====================
#todo:  need to script this:

# ------------------------
# Apache2 + Needed Modules
# ------------------------
sudo apt-get install apache2 libapache2-mod-fcgid libapache2-mod-xsendfile libapache2-mod-wsgi
sudo apt-get install sendmail libmail-sendmail-perl

# -------------
# GIS Libraries
# -------------
sudo apt-get install python-software-properties
sudo add-apt-repository ppa:ubuntugis/ppa
sudo apt-get update
sudo apt-get install mapserver-bin gdal-bin cgi-mapserver
sudo apt-get install python-gdal python-mapscript

# --------------------
# PostgreSQL + PostGIS
# --------------------
sudo apt-get install postgresql-9.1 postgresql-client-9.1 
sudo apt-get install postgresql-server-dev-9.1 postgresql-contrib postgresql-plperl-9.1
sudo apt-get install postgresql-9.1-postgis
sudo apt-get install postgresql-server-dev-9.1 postgresql-plperl-9.1

# -------------------------
# OPEN CV (Computer Vision)
# -------------------------
sudo add-apt-repository ppa:gijzelaar/opencv2
sudo apt-get update
sudo apt-get install libcv2.3 libopencv-dev python-opencv

# ------------------------------------------------
# Install Pip and some Python-related dependencies
# ------------------------------------------------
sudo apt-get install python-psycopg2
sudo apt-get install python-pip python-dev

# -------------
# Miscellaneous
# -------------
sudo apt-get install openjdk-7-jdk
sudo apt-get install python-scipy ffmpeg libavcodec-extra-53


======================
Install Python Modules
======================
sudo pip install -r requirements.txt


=========================
Configure the Application
=========================
Run ./setup.sh to configure Apache and your settings_local.py,
the database, and the application.  This could also be done
manually, if you prefer.

=====
TODOS
=====
* Check that the mod_xsendfile is installed and enabled
* Run script to create a new PostGIS database, if requested,  Also check 
* Automate some of this with Fabric (though the bash script might be good enough for now):
	http://chimera.labs.oreilly.com/books/1234000000754/ch08.html#_automating_deployment_with_fabric
	http://dan.bravender.us/2012/5/11/git-based_fabric_deploys_are_awesome.html
	
