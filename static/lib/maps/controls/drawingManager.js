define(["marionette",
        "underscore",
        "lib/maps/controls/searchBox",
        "lib/maps/controls/tileController"
    ],
    function (Marionette, _, SearchBox, TileController) {

        var DrawingManager = Marionette.View.extend({

            initialize: function (opts) {
                //required opts:
                // basemapView
                // map
                _.extend(this, opts);
                this.color = '#ed867d';

                // for adding points, lines, polygons, and rectangles to the map:
                this.listenTo(this.app.vent, 'place-marker', this.placeMarkerOnMapXY);
                this.listenTo(this.app.vent, 'add-rectangle', this.initRectangleMode);
                this.listenTo(this.app.vent, 'add-polyline', this.initPolylineMode);
                this.listenTo(this.app.vent, 'add-polygon', this.initPolygonMode);
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

            initRectangleMode: function() {
                this.initDrawingManager(google.maps.drawing.OverlayType.RECTANGLE);
            },
            initPolylineMode: function(model) {
                this.activateMarker(model);
                this.initDrawingManager(google.maps.drawing.OverlayType.POLYLINE);
            },
            initPolygonMode: function(model) {
                this.activateMarker(model);
                this.initDrawingManager(google.maps.drawing.OverlayType.POLYGON);
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

                    // make sure we're using the correct fill and stroke colors
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

            polygonComplete: function (temporaryPolygon) {
                //internal function to convert google to geoJSON:
                const googlePolygonToGeoJSON = (polygon) => {
                    var pathCoords = polygon.getPath().getArray(),
                        coords = [],
                        i = 0;
                    for (i; i < pathCoords.length; i++) {
                        coords.push([pathCoords[i].lng(), pathCoords[i].lat()]);
                    }
                    //add last coordinate again:
                    coords.push([pathCoords[0].lng(), pathCoords[0].lat()]);
                    return { type: 'Polygon', coordinates: [coords] };
                };
                this.notify(googlePolygonToGeoJSON(temporaryPolygon));
                this.clear(temporaryPolygon);
            },

            polylineComplete: function (temporaryPolyline) {
                const googlePolylineToGeoJSON = (polyline) => {
                    var pathCoords = polyline.getPath().getArray(),
                        coords = [],
                        i = 0;
                    for (i; i < pathCoords.length; i++) {
                        coords.push([pathCoords[i].lng(), pathCoords[i].lat()]);
                    }
                    return { type: 'LineString', coordinates: coords };
                }
                this.notify(googlePolylineToGeoJSON(temporaryPolyline));
                this.clear(temporaryPolyline);
            },

            rectangleComplete: function (rect) {
                rect.setOptions({ editable: false });
                this.drawingManager.setDrawingMode(null);
                var getGeoJSONFromBounds = function (r) {
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
                    r = getGeoJSONFromBounds(rect);

                // hide the rectangle because we are manually displaying
                // the map ourselves via 'that.targetedModel.trigger('show-marker');'
                rect.setMap(null);
                this.targetedModel.set("geometry", r);
                //this.targetedModel.trigger('show-marker');
                this.addMarkerClicked = false;
                this.targetedModel = null;
                this.drawingManager.setMap(null);
                $('body').css({ cursor: 'auto' });
            },

            notify: function (geoJSON) {
                this.app.vent.trigger(
                    'geometry-created', {
                        'geometry': geoJSON
                    });
            },
            clear: function (temporaryOverlay) {
                temporaryOverlay.setMap(null);
                this.drawingManager.setOptions({
                    drawingMode: null,
                    drawingControl: false
                });
            },

            placeMarkerOnMapXY: function (point) {
                var location = this.point2LatLng(point);
                this.placeMarkerOnMap(location);
            },

            // If the add marker button is clicked, allow user to add marker on click
            // after the marker is placed, disable adding marker and hide the "add marker" div
            placeMarkerOnMap: function (location) {
                if (!this.addMarkerClicked) {
                    return;
                }
                this.targetedModel.trigger('commit-data-no-save');
                if (!this.targetedModel.get("id")) {
                    this.targetedModel.collection.add(this.targetedModel);
                }
                this.targetedModel.setPointFromLatLng(location.lat(), location.lng());
                this.targetedModel.trigger('show-marker');
                this.targetedModel.save();
                console.log(this.targetedModel);
                this.app.vent.trigger('rerender-data-detail');
                this.addMarkerClicked = false;
                this.targetedModel = null;
            }
        });
        return DrawingManager;
    });
