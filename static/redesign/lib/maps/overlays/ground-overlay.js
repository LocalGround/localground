define(["lib/maps/overlays/polyline"], function (Polyline) {
    "use strict";
    /**
     * Functions to help move from lat/lngs to GeoJSON
     * formats and vice versa
     * @class Polygon
     */
    var GroundOverlay = function (app, opts) {
        Polyline.call(this, app, opts);
        this.editPolygon = null;
        this.timer = null;
        this.isShowingOnMap = false;
        this.getShapeType = function () {
            return "GroundOverlay";
        };

        this.createOverlay = function (isShowingOnMap) {
            this.isShowingOnMap = isShowingOnMap;
            this._googleOverlay = new google.maps.GroundOverlay(
                this.model.get("overlay_path"),
                this.getBoundsFromGeoJSON(),
                {
                    map: isShowingOnMap ? this.map : null,
                    opacity: 1,
                    clickable: true
                }
            );
            this.attachGroundOverlayEventHandler();
        };

        this.makeViewable = this.makeEditable = function (model) {
            return true;
        };

        this.getGoogleLatLngFromModel = function () {
            return null;
        };

        this.getCenter = this.getCenterPoint = function () {
            return this.getBounds().getCenter();
        };

        this.getBounds = function () {
            return this._googleOverlay.getBounds();
        };

        this.getPolygonFromBounds = function () {
            var bounds = this.getBounds(),
                path = [],
                ne = bounds.getNorthEast(),
                sw = bounds.getSouthWest();
            path.push(ne);
            path.push(new google.maps.LatLng(sw.lat(), ne.lng()));
            path.push(sw);
            path.push(new google.maps.LatLng(ne.lat(), sw.lng()));
            return path;
        };

        this.redraw = function () {
            console.log("REDRAW");
            if (this.app.mode == 'edit' && this.model.get("active") && this.model.get("geometry")) {
                this.editPolygon = new google.maps.Rectangle({
                    bounds: this.getBounds(),
                    strokeColor: '#ed867d',
                    strokeOpacity: 1.0,
                    strokeWeight: 4,
                    fillColor: '#FFF',
                    fillOpacity: 0.5,
                    map: this.map,
                    draggable: true,
                    editable: true
                });
                this.attachPolygonEventHandler();
            } else if (this.editPolygon) {
                this.editPolygon.setMap(null);
            }
        };

        this.attachGroundOverlayEventHandler = function () {
            var that = this;
            google.maps.event.addListener(this._googleOverlay, 'click', function () {
                console.log('clicked.');
                that.app.router.navigate("//" + that.model.getDataTypePlural() + "/" + that.model.get("id"));
            });
        };

        this.attachPolygonEventHandler = function () {
            var that = this;
            google.maps.event.addListener(this.editPolygon, 'bounds_changed', function () {
                that._googleOverlay.setMap(null);
                that.setGeometryFromOverlay();
                that.createOverlay(true);
                if (that.timer) {
                    clearTimeout(that.timer);
                }
                //that.timer = setTimeout(function () { that.model.save(); }, 500);
            });
        };

        this.getBoundsFromGeoJSON = function () {
            var coordinates = this.model.get("geometry").coordinates[0],
                north = coordinates[0][1],
                east = coordinates[0][0],
                south = coordinates[2][1],
                west = coordinates[2][0];
            return new google.maps.LatLngBounds(
                new google.maps.LatLng(south, west),
                new google.maps.LatLng(north, east)
            );
        };

        this.getGeoJSONFromBounds = function () {
            var bounds = this.editPolygon.getBounds().toJSON(),
                north = bounds.north,
                south = bounds.south,
                east = bounds.east,
                west = bounds.west;
            return {
                "type": "Polygon",
                "coordinates": [[
                    [east, north],
                    [east, south],
                    [west, south],
                    [west, north],
                    [east, north]
                ]]
            };
        };

        this.setGeometryFromOverlay = function () {
            this.model.set("geometry", this.getGeoJSONFromBounds());
        };

        /**
         * Method that converts a google.maps.Polygon
         * into a GeoJSON Linestring object.
         * @see See the Google <a href="https://developers.google.com/maps/documentation/javascript/reference#Polygon">google.maps.Polygon</a>
         * documentation for more details.
         * @returns a GeoJSON Polygon object
         */
        this.getGeoJSON = function () {
            //note that bounds / polygon is read-only
            return this.model.get("geometry");
        };

		this.intersects = function (latLng) {
            //alert("No yet implemented.");
            return false;
        };

        this.initialize(app, opts);
    };
    return GroundOverlay;
});