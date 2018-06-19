#!/bin/bash

##################################
##				##
#	  CONFIG SSL 	 	 #
##				##
##################################
#
# This section configures ssl snippet for nginx based on either dev environment or production
#
# NOTE:	Best practice: https://mozilla.github.io/server-side-tls/ssl-config-generator/
#
## TODO: Check Qualys SSL afterwards for privacy score. https://github.com/ssllabs/ssllabs-scan/

echo -e $"CONFIG: TLS Encryption." | tee -a "$log_file"

## Check if SSL snippets directory exists or not.
    echo -e $"CHECK: /etc/nginx/snippets/" | tee -a "$log_file"
if ! [ -d /etc/nginx/snippets/ ]; then
	### create the directory
	mkdir /etc/nginx/snippets/
	### give permission to snippets dir
	chmod 755 /etc/nginx/snippets/
fi
    echo -e $"✓ SUCCESS: Directory '/etc/nginx/snippets/' created! \n" | tee -a "$log_file"

## DEV = TRUE
# Generate SSL cert
# Set public .crt file, private .pem file, and dhparam file locations

if [ "$development" = true ] ; then
	## Generate weak Diffie-Helman key (for Perfect Forward Secrecy).
	echo -e $"CONFIG: Now Generating weak Diffie-Helman key." | tee -a "$log_file"
	/usr/bin/openssl dhparam -out /etc/ssl/certs/dhparam.pem 1024
	echo -e $"✓ SUCCESS: Installed Diffie-Helman key! \n" | tee -a "$log_file"

	## Self signed crt
	echo -e $"CONFIG: Now Generating weak Self Singed Cert." | tee -a "$log_file"
	/usr/bin/openssl req -x509 -newkey rsa:2048 -keyout /etc/ssl/certs/key.pem -out /etc/ssl/certs/cert.pem -days 365 -nodes -subj "/C=US/ST=California/L=Berkeley/O=Local Ground/OU=Org/CN=dev.localground.org"
	echo -e $"✓ SUCCESS: Installed Self Signed certificate! \n" | tee -a "$log_file"

	## Set locations to variables
	ssl_cert="/etc/ssl/certs/cert.pem"
	ssl_key="/etc/ssl/certs/key.pem"
	dhparam="/etc/ssl/certs/dhparam.pem"
fi

## DEV = False
# INSTALL certbot
# Obtain SSL cert
# Set public .crt file, private .pem file, and dhparam file locations

if [ "$development" = false ] ; then
	## Generate weak Diffie-Helman key (for Perfect Forward Secrecy).
	echo -e $"CONFIG: Now Generating strong Diffie-Helman key." | tee -a "$log_file"
	/usr/bin/openssl dhparam -out /etc/ssl/certs/dhparam.pem 4096
	echo -e $"✓ SUCCESS: Installed Diffie-Helman key! \n" | tee -a "$log_file"

	echo -e $"CONFIG: Now Installing Certbot." | tee -a "$log_file"
	apt-get install software-properties-common -y
	add-apt-repository ppa:certbot/certbot -y
	apt-get update
	apt-get install python-certbot-nginx -y
	echo -e $"✓ SUCCESS: Installed Certbot! \n" | tee -a "$log_file"

	## Generate strong Diffie-Helman key (for Perfect Forward Secrecy).
	echo -e $"CONFIG: Now Generating strong Diffie-Helman key." | tee -a "$log_file"
#	/usr/bin/openssl dhparam -out /etc/ssl/certs/dhparam.pem 4096
	echo -e $"✓ SUCCESS Installed Diffie-Helman key! \n" | tee -a "$log_file"

	## Generate TLS cert.
	echo -e $"CONFIG: Now installing Let's Encrypt TLS certificate." | tee -a "$log_file"
	certbot --authenticator nginx --installer nginx --agree-tos --no-eff-email -m $emailaddr -d $domain || { echo 'cerbot failed' ; exit 1; }
	echo -e $"✓ SUCCESS: Installed Let's Encrypt TLS certificate! \n" | tee -a "$log_file"

	## Set locations to variables
	ssl_cert="/etc/letsencrypt/live/$domain/fullchain.pem"
	ssl_key="/etc/letsencrypt/live/$domain/privkey.pem"
	dhparam="/etc/ssl/certs/dhparam.pem"
fi

## Create TLS snippets
mkdir /etc/nginx/snippets/

echo -e $"CONFIG: TLS Snippet." | tee -a "$log_file"

if ! echo "## SSL Certs
    ssl_certificate $ssl_cert;
    ssl_certificate_key $ssl_key; # private key file

## SSL Config
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;
    ssl_dhparam $dhparam;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers 'ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:ECDHE-ECDSA-DES-CBC3-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA:!DSS';
    ssl_prefer_server_ciphers on;

## HSTS (ngx_http_headers_module is required) (15768000 seconds = 6 months)
    add_header Strict-Transport-Security max-age=15768000;

## OCSP Stapling
    # fetch OCSP records from URL in ssl_certificate and cache them
    ssl_stapling on;
    ssl_stapling_verify on;

    ## verify chain of trust of OCSP response using Root CA and Intermediate certs
    ssl_trusted_certificate $ssl_cert;

    resolver 8.8.8.8;
" > $sslsnippet
	then
		echo -e $"✗ FAIL: There is an ERROR creating $sslsnippet file. \n" | tee -a "$log_file"
		exit;
	else
		echo -e $"✓ SUCCESS: TLS Snippet file created! \n" | tee -a "$log_file"
	fi
