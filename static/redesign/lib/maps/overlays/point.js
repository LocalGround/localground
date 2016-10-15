define(["jquery", "underscore"], function ($, _) {
    "use strict";
    /**
     * Class that controls marker point model overlays.
     * @class Point
     */
    var Point = function (app, opts) {

        this._googleOverlay = null;
        this.model = null;
        this.map = null;
        this.Shapes = null;

        this.getShapeType = function () {
            return "Point";
        };

        this.initialize = function (app, opts) {
            this.app = app;
            $.extend(this, opts);
            this.Shapes = _.clone(Point.Shapes); //call to static method.
            this.createOverlay(opts.isShowingOnMap || false);
        };

        this.createOverlay = function (isShowingOnMap) {
            if (this.model.get("geometry") != null) {
                this._googleOverlay = new google.maps.Marker({
                    position: this.getGoogleGeometryFromModel(),
                    map: isShowingOnMap ? this.map : null
                });
            }
        };

        this.restoreModelGeometry =  function () {
            this._googleOverlay.setPosition(this.getGoogleGeometryFromModel());
        };

        this.getCenter = function () {
            return this.getGoogleGeometryFromModel();
        };

        this.getBounds = function () {
            var bounds = new google.maps.LatLngBounds();
            bounds.extend(this.getCenter());
            return bounds;
        };

        this.centerOn = function () {
            this.map.panTo(this.getCenter());
        };

        this.zoomTo = function () {
            this.map.setCenter(this.getCenter());
            if (this.map.getZoom() < 17) {
                this.map.setZoom(17);
            }
        };

        /**
         * Method that converts a GeoJSON Point into
         * a google.maps.LatLng object.
         * @param {GeoJSON Point} geoJSON
         * A GeoJSON Point object
         * @returns {google.maps.LatLng}
         * A google.maps.LatLng object
         */
        this.getGoogleGeometryFromModel = function () {
            var geoJSON = this.model.get("geometry");
            return new google.maps.LatLng(
                geoJSON.coordinates[1],
                geoJSON.coordinates[0]
            );
        };

        /**
         * Method that converts a google.maps.Point
         * into a GeoJSON Point object.
         * @param {google.maps.LatLng} googlePoint
         * A Google point object.
         * @see See the Google <a href="https://developers.google.com/maps/documentation/javascript/reference#LatLng">google.maps.LatLng</a>
         * documentation for more details.
         * @returns a GeoJSON Point object
         */
        this.getGeoJSON = function (latLng) {
            return {
                type: 'Point',
                coordinates: [latLng.lng(), latLng.lat()]
            };
        };

        this.clearEditListeners = function () {
            google.maps.event.clearListeners(this._googleOverlay, 'drag');
            google.maps.event.clearListeners(this._googleOverlay, 'dragstart');
            google.maps.event.clearListeners(this._googleOverlay, 'dragend');
		};

        this.makeViewable = function () {
            this._googleOverlay.setOptions({'draggable': false, 'title': ''});
            this.clearEditListeners();
        };

        this.makeEditable = function (model) {
            var that = this;
            this.clearEditListeners();
			this._googleOverlay.setOptions({
                'draggable': true,
                'title': 'Drag this icon to re-position it'
            });
            google.maps.event.addListener(this._googleOverlay, "dragstart", function () {
                that.app.vent.trigger("hide-tip");
                that.app.vent.trigger("hide-bubble", { model: model });
            });

            google.maps.event.addListener(this._googleOverlay, "dragend", function (mEvent) {
                that.map.panTo(that._googleOverlay.position);
                if (model.getKey() != "markers") {
                    that.app.vent.trigger("drag-ended", {
                        latLng: mEvent.latLng,
                        model: model
                    });
                } else {
                    that.saveShape(model);
                }
            });

            google.maps.event.addListener(this._googleOverlay, "drag", function (mEvent) {
                if (model.getKey() != "markers") {
                    that.app.vent.trigger("dragging", {
                        latLng: mEvent.latLng
                    });
                }
            });
        };

        this.saveShape = function (model) {
            model.set("geometry", this.getGeoJSON());
            model.save();
        };

        this.getGeoJSON = function () {
            var latLng = this._googleOverlay.position;
            return {
                type: 'Point',
                coordinates: [latLng.lng(), latLng.lat()]
            };
        };

        this.setIcon = function (icon) {
            this._googleOverlay.setOptions({
                icon: icon
            });
        };

        this.intersects = function (latLng) {
            var r = 10,
                projection = this.app.getOverlayView().getProjection(),
                position = projection.fromLatLngToContainerPixel(latLng),
                currentPosition = projection.fromLatLngToContainerPixel(this._googleOverlay.getPosition()),
                rV = 20,
                rH = 10,
                top,
                bottom,
                left,
                right,
                withinBuffer;

            if (this._googleOverlay.icon && this._googleOverlay.icon.size) {
                rV = this._googleOverlay.icon.size.height;  // vertical radius
                rH = this._googleOverlay.icon.size.width;   // horizontal radius
            }
            top = position.y - rV;
            bottom = position.y + rV;
            left = position.x - rH;
            right = position.x + rH;

            withinBuffer = currentPosition.y  <= bottom + r &&
							   currentPosition.y >= top - 2 * r &&
							   currentPosition.x <= right + r &&
							   currentPosition.x >= left - r;
            if (withinBuffer) {
                return true;
            }
            return false;
        };

        this.initialize(app, opts);

    };
    /**
        STATIC METHOD
        --------------------------------------------------------------------------------------
        Available SVG shapes.
        @see See <a href="//raphaeljs.com/icons/#location">Shape Wizard</a>
        to add more icons.
       
        To generate SVGs from FontAwesome Icon set on Linux:
           1) sudo npm install -g font-awesome-svg-png
           2) sudo apt-get install librsvg2-bin
           3) font-awesome-svg-png --color red --sizes 128,256 //dumps icons into a directory called "red"
    */
    Point.Shapes = {
        //MAP_PIN: 'M0-165c-27.618 0-50 21.966-50 49.054C-50-88.849 0 0 0 0s50-88.849 50-115.946C50-143.034 27.605-165 0-165z',
        //SQUARE_PIN: 'M 50 -119.876 -50 -119.876 -50 -19.876 -13.232 -19.876 0.199 0 13.63 -19.876 50 -19.876 Z',
        //SHEILD: 'M42.8-72.919c0.663-7.855 3.029-15.066 7.2-21.675L34.002-110c-5.054 4.189-10.81 6.509-17.332 6.919 c-5.976 0.52-11.642-0.574-16.971-3.287c-5.478 2.626-11.121 3.723-17.002 3.287c-6.086-0.523-11.577-2.602-16.495-6.281 l-16.041 15.398c3.945 6.704 6.143 13.72 6.574 21.045c0.205 3.373-0.795 8.016-3.038 14.018c-1.175 3.327-2.061 6.213-2.667 8.627 c-0.562 2.394-0.911 4.34-1.027 5.801c-0.082 6.396 1.78 12.168 5.602 17.302c2.986 3.745 7.911 7.886 14.748 12.41 c7.482 3.665 13.272 6.045 17.326 7.06c1.163 0.521 2.301 1.025 3.363 1.506C-7.9-5.708-6.766-5.232-5.586-4.713 C-3.034-3.242-1.243-1.646-0.301 0C0.858-1.782 2.69-3.338 5.122-4.713c1.717-0.723 3.173-1.346 4.341-1.896 c1.167-0.494 2.037-0.865 2.54-1.09c0.866-0.414 2.002-0.888 3.376-1.41c1.386-0.527 3.101-1.168 5.144-1.882 c3.951-1.348 6.83-2.62 8.655-3.77c6.634-4.524 11.48-8.595 14.566-12.235c3.958-5.152 5.879-10.953 5.79-17.475 c-0.232-2.922-1.52-7.594-3.85-13.959C43.463-64.631 42.479-69.445 42.8-72.919z',
        //ROUTE: 'M49.986-58.919c-0.51-27.631-16.538-38.612-17.195-39.049l-2.479-1.692l-2.5 1.689c-4.147 2.817-8.449 4.247-12.783 4.247 c-7.178 0-12.051-3.864-12.256-4.032L-0.023-100l-2.776 2.248c-0.203 0.165-5.074 4.028-12.253 4.028 c-4.331 0-8.63-1.429-12.788-4.253l-2.486-1.678l-2.504 1.692c-1.702 1.17-16.624 12.192-17.165 38.907 C-50.211-56.731-43.792-12.754-0.003 0C47.609-13.912 50.23-56.018 49.986-58.919z',
        // OVAL: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0'
        SQUARE: {
            markerSize: 100,
            scale: 1,
            path: 'M50-80c0-11-9-20-20-20h-60c-11 0-20 9-20 20v60c0 11 9 20 20 20h60c11 0 20-9 20-20V-80z',
            anchor: new google.maps.Point(0, -50),
            size: new google.maps.Size(100, 100),
            origin: new google.maps.Point(100, 100),
            viewBox: '-50 -100 100 100'
        },
        MAP_PIN_HOLLOW: {
            markerSize: 30.0,
            scale: 1.6,
            path: 'M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z',
            anchor: new google.maps.Point(16, 30),
            size: new google.maps.Size(15, 30),
            origin: new google.maps.Point(0, 0),
            viewBox: '6 3 20 30'
        },
        CIRCLE: {
            markerSize: 40.0,
            scale: 1,
            path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0',
            anchor: new google.maps.Point(0, 0),
            size: new google.maps.Size(40.0, 40.0),
            origin: new google.maps.Point(0, 0),
            viewBox: '-20 -20 40 40'
        },
        SOUND: {
            markerSize: 30.0,
            scale: 1,
            path: 'M4.998,12.127v7.896h4.495l6.729,5.526l0.004-18.948l-6.73,5.526H4.998z M18.806,11.219c-0.393-0.389-1.024-0.389-1.415,0.002c-0.39,0.391-0.39,1.024,0.002,1.416v-0.002c0.863,0.864,1.395,2.049,1.395,3.366c0,1.316-0.531,2.497-1.393,3.361c-0.394,0.389-0.394,1.022-0.002,1.415c0.195,0.195,0.451,0.293,0.707,0.293c0.257,0,0.513-0.098,0.708-0.293c1.222-1.22,1.98-2.915,1.979-4.776C20.788,14.136,20.027,12.439,18.806,11.219z M21.101,8.925c-0.393-0.391-1.024-0.391-1.413,0c-0.392,0.391-0.392,1.025,0,1.414c1.45,1.451,2.344,3.447,2.344,5.661c0,2.212-0.894,4.207-2.342,5.659c-0.392,0.39-0.392,1.023,0,1.414c0.195,0.195,0.451,0.293,0.708,0.293c0.256,0,0.512-0.098,0.707-0.293c1.808-1.809,2.929-4.315,2.927-7.073C24.033,13.24,22.912,10.732,21.101,8.925z M23.28,6.746c-0.393-0.391-1.025-0.389-1.414,0.002c-0.391,0.389-0.391,1.023,0.002,1.413h-0.002c2.009,2.009,3.248,4.773,3.248,7.839c0,3.063-1.239,5.828-3.246,7.838c-0.391,0.39-0.391,1.023,0.002,1.415c0.194,0.194,0.45,0.291,0.706,0.291s0.513-0.098,0.708-0.293c2.363-2.366,3.831-5.643,3.829-9.251C27.115,12.389,25.647,9.111,23.28,6.746z',
            anchor: new google.maps.Point(16, 30),
            size: new google.maps.Size(30.0, 30.0),
            origin: new google.maps.Point(0, 0)
        }
    };
    return Point;
});
