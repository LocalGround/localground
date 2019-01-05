#!/bin/bash

##################################
##				##
#	  CONFIG NGINX		 #
##				##
##################################
#
# This section creates virtual host rules file.
#

## Create NGINX Config

echo -e $"CONFIG: nginx" | tee -a "$log_file"

## remove default site
rm /etc/nginx/sites-enabled/default

## echo config to file
	if ! echo "## DJANGO Upstream
upstream django {
	server 0.0.0.0:8000;			# for a web port socket
	# run: python $userDir$rootDir/apps/manage.py runserver 0.0.0.0:8000
        }

server {
## Listen on IPv4 and IPv6
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name $domain;
    
## Redirect all HTTP requests to HTTPS with a 301 Moved Permanently response.
    return 301 https://\$host\$request_uri;
}

server {
## Listen on IPv4 and IPv6
    listen 443 ssl http2 default_server;
    listen [::]:443 ssl http2 default_server;
    server_name $domain;
    
## Logs
    access_log   /var/log/nginx/$domain.access.log;
    error_log    /var/log/nginx/$domain.error.log;

## SSL Options
include $sslsnippet;

## Upload Options
   client_max_body_size 1024m;
   client_body_timeout 480s;

## Serve the Django Application website
    root    $userDir$rootDir;

## Django UserData
    location /userdata  {
	alias $userDir$rootDir/userdata;	# your Django project's media files
    }

## Django static files
    location /static {
	alias $userDir$rootDir/static;		# your Django project's static files
    }

## Finally, Set headers and send all non-media requests to the Django server.
    location / {
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header Host \$http_host;
        proxy_redirect off;
        proxy_set_header X-Forwarded-Proto \$scheme;

	proxy_pass      http://django/;
	include         uwsgi_params;
	# after you install the socket, uncomment this line (production)
        # uwsgi_pass      unix:/run/uwsgi/localground-apps.sock;  
    }
}" > $sitesAvailable$domain

	then
		echo -e $"✗ FAIL: Could not create Virtual Host file '$domain' \n" | tee -a "$log_file"
		exit;
	else
		echo -e $"✓ SUCCESS: Virtual Host file '$domain' created! \n" | tee -a "$log_file"
fi

## Add domain in /etc/hosts
if ! echo "127.0.0.1	$domain" >> /etc/hosts
	then
		echo -e $"✗ FAIL: Not able to write '/etc/hosts' file. \n" | tee -a "$log_file"
		exit;
else
	echo -e $"✓ SUCCESS: Host added to '/etc/hosts' file! \n" | tee -a "$log_file"
fi
