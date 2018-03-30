define(["jquery"], function ($) {
    "use strict";
    /**
     * Class that controls marker point model overlays.
     * @class Point
     */
    var Polyline = function (app, opts) {

        this._googleOverlay = null;
        this.model = null;
        this.map = null;
        this.mouseupEvent = null;
        this.mousedownEvent = null;
        this.rightClickEvent = null;

        // See this.deleteVertex().
        // A Polyline cannot have fewer than 2 vertices
        this.minimumVertices = 2

        this.getShapeType = function () {
            return "Polyline";
        };

        this.initialize = function (app, opts) {
            this.app = app;
            $.extend(this, opts);
            this.createOverlay(opts.isShowingOnMap || false);
        };

        this.createOverlay = function (isShowingOnMap) {
            this._googleOverlay = new google.maps.Polyline({
                path: this.getGoogleGeometryFromModel(),
                strokeColor: '#' + this.model.get("strokeColor"),
                strokeOpacity: 1.0,
                strokeWeight: 5,
                map: isShowingOnMap ? this.map : null,
                //editable: true,
                draggable: true

            });
        };

        this.redraw = function () {
            this._googleOverlay.setOptions({
                //strokeColor: '#' + this.model.get("strokeColor")
                //strokeColor: this.model.collection.fillColor,
                path: this.getGoogleGeometryFromModel(),
                strokeColor: this.symbol.get('fillColor'),
                strokeOpacity: 1.0,
                strokeWeight: this.active ? 8 : 5,
                draggable: this.active ? true : false,
                editable: this.active ? true : false,
            });
            if (this.active) {
                this.addEvents();
            }
        };

        /**
        * We want to save polyline/polygon coordinates after the following 4 events:
        * 1. dragging the entire polyline/polygon
        * 2. dragging (editing) individual vertices
        * 3. adding a new vertex
        * 4. Deleting a vertex (right click)
        */
       this.addEvents = function() {
            // clear previous right click listeners
            if (this.rightClickEvent) {
                google.maps.event.clearListeners(this._googleOverlay, 'rightclick');
            }
            this.rightClickEvent = google.maps.event.addListener(
                this._googleOverlay, 'rightclick', this.deleteVertex.bind(this)
            );

            // clear previous listeners of the mousedown event
            if (this.mousedownEvent) {
                google.maps.event.clearListeners(this._googleOverlay, 'mousedown');
            }
            // We will only register a mouseup event after a mousedown event has ocurred.
            // Since mouseup events can be rather buggy, this helps keep things clean
            // and prevents errant mouseup events from creating duplicate events and other proplems
            this.mousedownEvent = google.maps.event.addListener(
                this._googleOverlay, 'mousedown', this.registerMouseUpEvent.bind(this)
            );
        };

        this.registerMouseUpEvent = function() {
            // clear any previous mouse up events
            if (this.mouseupEvent) {
                google.maps.event.clearListeners(this._googleOverlay, 'mouseup');
            }
            // register mouseup event and callback
            this.mouseupEvent = google.maps.event.addListener(
                this._googleOverlay, 'mouseup', this.geometrySave.bind(this)
            );
        };
        this.geometrySave = function() {

            // A slight delay is needed here to make sure any new coordinate values
            // finish updating the _googleOverlay object before we attempt to save
            setTimeout(() => {
                this.model.trigger('commit-data-no-save');

                // get the coordinated from the _googleOverlay
                const geoJSON = this.getGeoJSON();

                // We only update and save the model if its current geometry coordinates
                // are different from those of the _googleOverlay
                if (!_.isEqual(this.model.get('geometry'), geoJSON)) {
                    this.model.set('geometry', geoJSON);
                    this.model.save();
                }
            }, 100);
        };

        this.deleteVertex = function(ev) {
            // slight delay needed to prevent multiple events from being triggered
            setTimeout(() => {
                                                // line must have at least 2 vertices
                if (ev.vertex != null && this._googleOverlay.getPath().getLength() > this.minimumVertices) {
                    this._googleOverlay.getPath().removeAt(ev.vertex);
                    this.geometrySave();
                }
            }, 100);
            
            //this.registerMouseUpEvent();
        };

        /**
         * An approximation for the center point of a polyline.
         * @param {google.maps.Polyline} googlePolyline
         * @returns {google.maps.LatLng}
         * A latLng corresponding the approximate center of the
         * polyline.
         */
        this.getCenter = function () {
            var coordinates = this._googleOverlay.getPath().getArray();
            return coordinates[Math.floor(coordinates.length / 2)];
        };

        this.centerOn = function () {
            this.map.panTo(this.getCenter());
        };

        this.zoomTo = function () {
            this.map.fitBounds(this.getBounds());
        };

        /**
         * Method that calculates the bounding box of a
         * google.maps.Polyline (in miles)
         * @param {google.maps.Polyline} googlePolyline
         * A Google polyline object.
         * @returns {google.maps.LatLngBounds}
         * The bounding box.
         */
        this.getBounds = function () {
            var bounds = new google.maps.LatLngBounds(),
                coords = this._googleOverlay.getPath().getArray(),
                i = 0;
            for (i; i < coords.length; i++) {
                bounds.extend(coords[i]);
            }
            return bounds;
        };

        this.show = function () {
            this._googleOverlay.setMap(this.map);
        };

        this.hide = function () {
            this._googleOverlay.setMap(null);
        };

        /**
         * Method that converts a google.maps.Polyline
         * into a GeoJSON Linestring object.
         * @param {google.maps.Polyline} googlePolyline
         * A Google polyline object.
         * @see See the Google <a href="https://developers.google.com/maps/documentation/javascript/reference#Polyline">google.maps.Polyline</a>
         * documentation for more details.
         * @returns a GeoJSON Linestring object
         */
        this.getGeoJSON = function () {
            var pathCoords = this._googleOverlay.getPath().getArray(),
                coords = [],
                i = 0;
            for (i; i < pathCoords.length; i++) {
                coords.push([pathCoords[i].lng(), pathCoords[i].lat()]);
            }
            return { type: 'LineString', coordinates: coords };
        };

        /**
         * Method that converts a GeoJSON Linestring into
         * an array of google.maps.LatLng objects.
         * @param {GeoJSON Linestring} geoJSON
         * A GeoJSON Linestring object
         * @returns {Array}
         * An array of google.maps.LatLng objects.
         */
        this.getGoogleGeometryFromModel = function () {
            var geoJSON = this.model.get("geometry"),
                path = [],
                coords = geoJSON.coordinates,
                i = 0;
            for (i; i < coords.length; i++) {
                path.push(new google.maps.LatLng(coords[i][1], coords[i][0]));
            }
            return path;
        };

        /**
         * Method that calculates the length of a
         * google.maps.Polyline (in miles)
         * @param {google.maps.Polyline} googlePolyline
         * A Google polyline object.
         * @returns {Number}
         * The length of the google.maps.Polyline object in miles.
         */
        this.calculateDistance = function () {
            var coords = this._googleOverlay.getPath().getArray(),
                distance = 0,
                i = 1;
            for (i; i < coords.length; i++) {
                distance += google.maps.geometry.spherical.computeDistanceBetween(coords[i - 1], coords[i]);
            }
            return Math.round(distance / 1609.34 * 100) / 100;
        };

        this.makeViewable = function () {
            this._googleOverlay.setOptions({'draggable': false, 'editable': false});
            google.maps.event.clearListeners(this._googleOverlay.getPath());
        };

        this.makeEditable = function (model) {
            var that = this;
            google.maps.event.clearListeners(this._googleOverlay.getPath());
			this._googleOverlay.setOptions({'draggable': false, 'editable': true});
            google.maps.event.addListener(this._googleOverlay.getPath(), 'set_at', function () {
                that.saveShape(model);
            });
            google.maps.event.addListener(this._googleOverlay.getPath(), 'remove_at', function () {
                that.saveShape(model);
            });
            google.maps.event.addListener(this._googleOverlay.getPath(), 'insert_at', function () {
                that.saveShape(model);
            });

            google.maps.event.addListener(this._googleOverlay, 'rightclick', function (e) {
                if (e.vertex === undefined) {
                    return;
                }
                if (that._googleOverlay.getPath().getLength() <= 2) {
                    return;
                }
                that.app.vent.trigger('show-delete-menu', {
                    googleOverlay: that._googleOverlay,
                    point: e.vertex
                });
            });
        };

        this.restoreModelGeometry = function () {
            this._googleOverlay.setPath(this.getGoogleLatLngFromModel());
        };

        this.saveShape = function (model) {
            model.set("geometry", this.getGeoJSON());
            model.save();
        };

        this.intersects = function (latLng) {
            //alert("No yet implemented.");
            return false;
        };

        this.initialize(app, opts);

    };
    return Polyline;
});
