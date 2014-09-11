PROJ_FILE=/usr/share/proj/epsg
if grep -q "900913" $PROJ_FILE 
then
    echo '$PROJ_FILE already configured'
else
    echo 'Adding Projection 900913 to $PROJ_FILE'
	printf '\n#Google Projection\n<900913> +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs\n' | sudo tee -a $PROJ_FILE
fi
