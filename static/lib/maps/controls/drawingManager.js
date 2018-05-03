/**
  The Drawing Manager's only job is to put the map into a particular drawing mode
  (point, polygon, polyline, or rectangle), and raises an "geometry-created" event
  with the resulting geoJSON once the digitization process is complete.
*/
define(["jquery",
        "marionette",
        "lib/maps/controls/mouseMover",
    ],
    function ($, Marionette, MouseMover) {

        var DrawingManager = Marionette.View.extend({

            initialize: function (opts) {
                //required opts: basemapView, app
                this.basemapView = opts.basemapView;
                this.app = this.basemapView.app;
                this.map = this.basemapView.map;
                this.color = '#ed867d';
                this.listenTo(this.app.vent, 'point-complete', this.pointComplete);
                this.listenTo(this.app.vent, 'add-point', this.initPointMode);
                this.listenTo(this.app.vent, 'add-rectangle', this.initRectangleMode);
                this.listenTo(this.app.vent, 'add-polyline', this.initPolylineMode);
                this.listenTo(this.app.vent, 'add-polygon', this.initPolygonMode);
            },

            initDrawingManager: function (drawingMode) {
                var polyOpts = {
                    strokeWeight: 2,
                    strokeColor: this.color,
                    fillColor: this.color,
                    editable: true,
                    draggable: true
                };

                if (this.drawingManager) {
                    this.drawingManager.polygonOptions = polyOpts;
                    this.drawingManager.polylineOptions = polyOpts;
                    this.drawingManager.setMap(this.map);
                    this.drawingManager.setDrawingMode(drawingMode);
                    return;
                }

                this.drawingManager = new google.maps.drawing.DrawingManager({
                    drawingMode: drawingMode,
                    drawingControl: false,
                    markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
                    rectangleOptions: {
                        strokeColor: this.color,
                        fillColor: this.color,
                        fillOpacity: 0,
                        strokeWeight: 4,
                        clickable: false,
                        editable: true,
                        draggable: true,
                        zIndex: 1
                    },
                    polygonOptions: polyOpts,
                    polylineOptions: polyOpts
                });

                google.maps.event.addListener(this.drawingManager, 'polygoncomplete', this.polygonComplete.bind(this));
                google.maps.event.addListener(this.drawingManager, 'polylinecomplete', this.polylineComplete.bind(this));
                google.maps.event.addListener(this.drawingManager, 'rectanglecomplete', this.rectangleComplete.bind(this));
                this.drawingManager.setMap(this.map);
            },

            initPointMode: function (viewID, e) {
                this.viewID = viewID;
                const mm = new MouseMover(e, {app: this.app});
            },

            initRectangleMode: function(viewID) {
                this.viewID = viewID;
                this.initDrawingManager(google.maps.drawing.OverlayType.RECTANGLE);
            },

            initPolylineMode: function(viewID) {
                this.viewID = viewID;
                this.initDrawingManager(google.maps.drawing.OverlayType.POLYLINE);
            },

            initPolygonMode: function(viewID) {
                this.viewID = viewID;
                this.initDrawingManager(google.maps.drawing.OverlayType.POLYGON);
            },

            point2LatLng: function (point) {
                var topRight, bottomLeft, scale, worldPoint, offset;
                offset = this.basemapView.$el.offset();
                point.x -= offset.left;
                point.y -= offset.top;
                topRight = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getNorthEast());
                bottomLeft = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getSouthWest());
                scale = Math.pow(2, this.map.getZoom());
                worldPoint = new google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y);
                return this.map.getProjection().fromPointToLatLng(worldPoint);
            },

            pointComplete: function (point) {
                var location = this.point2LatLng(point);
                this.notify({
                    type: 'Point',
                    coordinates: [location.lng(), location.lat()]
                });
            },

            googlePolygonToGeoJSON: (polygon) => {
                var pathCoords = polygon.getPath().getArray(),
                    coords = [],
                    i = 0;
                for (i; i < pathCoords.length; i++) {
                    coords.push([pathCoords[i].lng(), pathCoords[i].lat()]);
                }
                //add last coordinate again:
                coords.push([pathCoords[0].lng(), pathCoords[0].lat()]);

                return { type: 'Polygon', coordinates: [coords] };
            },

            googlePolylineToGeoJSON: (polyline) => {
                var pathCoords = polyline.getPath().getArray(),
                    coords = [],
                    i = 0;
                for (i; i < pathCoords.length; i++) {
                    coords.push([pathCoords[i].lng(), pathCoords[i].lat()]);
                }
                return { type: 'LineString', coordinates: coords };
            },

            polygonComplete: function (temporaryPolygon) {
                this.notify(this.googlePolygonToGeoJSON(temporaryPolygon));
                this.clear(temporaryPolygon);
            },

            polylineComplete: function (temporaryPolyline) {
                this.notify(this.googlePolylineToGeoJSON(temporaryPolyline));
                this.clear(temporaryPolyline);
            },

            getGeoJSONFromBounds: function (r) {
                var bounds = r.getBounds().toJSON(),
                    north = bounds.north,
                    south = bounds.south,
                    east = bounds.east,
                    west = bounds.west;
                return {
                    "type": "Polygon",
                    "coordinates": [[
                        [east, north], [east, south], [west, south], [west, north], [east, north]
                    ]]
                };
            },

            rectangleComplete: function (rect) {
                rect.setOptions({ editable: false });
                this.drawingManager.setDrawingMode(null);

                this.notify(this.getGeoJSONFromBounds(rect));
                this.clear(rect);
                $('body').css({ cursor: 'auto' });
            },
            notify: function (geoJSON) {
                this.app.vent.trigger('geometry-created', {
                    geoJSON: geoJSON,
                    viewID: this.viewID
                });
            },
            clear: function (temporaryOverlay) {
                temporaryOverlay.setMap(null);
                this.drawingManager.setOptions({
                    drawingMode: null,
                    drawingControl: false
                });
            }
        });
        return DrawingManager;
    });
