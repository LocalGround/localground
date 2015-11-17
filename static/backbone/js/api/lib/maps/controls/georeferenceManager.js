define(["underscore", "jquery", "models/marker", "config"], function (_, $, Marker, Config) {
    "use strict";
    /**
     * Class that lets users update geometries and merge objects together.
     * @class DrawingManager
     * @param {options} opts
     *
     */
    var GeoreferenceManager = function (opts, basemap) {
        this.dm = null;
        this.polygonOptions = {
            strokeWeight: 0,
            fillOpacity: 0.45,
            editable: true
        };
        this.polylineOptions = {
            editable: true
        };
        this.Shapes = {
            MAP_PIN_HOLLOW: 'M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z',
            OVAL: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0'
        };
        this.markerOptions = {
            draggable: true,
            icon: {
                fillColor: '#999',
                strokeColor: "#FFF",
                strokeWeight: 1.5,
                fillOpacity: 1,
                path: this.Shapes.MAP_PIN_HOLLOW,
                scale: 1.6,
                anchor: new google.maps.Point(16, 30),      // anchor (x, y)
                size: new google.maps.Size(15, 30),         // size (width, height)
                origin: new google.maps.Point(0, 0)        // origin (x, y)
            }
        };

        this.highlightMarkerCircle = new google.maps.Marker({
            icon: {
                path: this.Shapes.OVAL,
                fillColor: '#BCE8F1',
                strokeColor: '#3A87AD',
                strokeWeight: 2.5,
                fillOpacity: 0.5,
                scale: 1.4
            },
            zIndex: 1
        });
        this.highlightMarker = new google.maps.Marker({
            icon: {
                path: this.Shapes.MAP_PIN_HOLLOW,
                fillColor: '#BCE8F1',
                strokeColor: '#3A87AD',
                strokeWeight: 1.5,
                fillOpacity: 1,
                scale: 1.6,
                anchor: new google.maps.Point(16, 30),      // anchor (x, y)
                size: new google.maps.Size(15, 30),         // size (width, height)
                origin: new google.maps.Point(0, 0)        // origin (x, y)
            }
        });

        this.highlight = function (marker) {
            if (marker.getShapeType() != "Point") {
                return;
            }
            this.highlightMarkerCircle.setPosition(marker.getCenter());
            this.highlightMarker.setPosition(marker.getCenter());
            // if-condition helps with blinking...
            if (!this.highlightMarkerCircle.getMap()) {
                this.highlightMarkerCircle.setMap(this.app.getMap());
                this.highlightMarker.setMap(this.app.getMap());
            }
        };

        this.unHighlight = function () {
            this.highlightMarkerCircle.setMap(null);
            this.highlightMarker.setMap(null);
        };

        this.initialize = function (opts) {
            this.app = opts.app;
            this.basemap = this.app.basemap;
            this.dm = new google.maps.drawing.DrawingManager({
                //drawingMode: google.maps.drawing.OverlayType.MARKER,
                markerOptions: this.markerOptions,
                polylineOptions: this.polylineOptions,
                polygonOptions: this.polygonOptions,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_LEFT,
                    drawingModes: [
                        google.maps.drawing.OverlayType.MARKER,
                        google.maps.drawing.OverlayType.POLYLINE,
                        google.maps.drawing.OverlayType.POLYGON
                    ]
                },
                map: null
            });
            this.attachEventHandlers();
        };

        this.attachEventHandlers = function () {
            var that = this;

            //add listeners:
            this.app.vent.on("mode-change", this.changeMode.bind(this));
            this.app.vent.on("dragging", this.showDragHighlighting.bind(this));
            this.app.vent.on("dragging-html-element", this.showHtmlDragHighlighting.bind(this));
            this.app.vent.on("drag-ended", this.saveDragChange.bind(this));
            this.app.vent.on("georeference-from-div", this.dropItem.bind(this));

            google.maps.event.addListener(this.dm, 'overlaycomplete', function (e) {
                that.addMarker(e.overlay);
            });
        };

        this.changeMode = function () {
            if (this.app.getMode() === "view") {
                this.hide();
            } else {
                this.show();
            }
        };

        this.show = function () {
            this.dm.setMap(this.app.getMap());
        };

        this.hide = function () {
            this.dm.setMap(null);
        };

        this.addMarker = function (googleOverlay) {
            var that = this,
                model = new Marker({
                    project_id: this.app.getActiveProjectID(),
                    color: "999999"
                });
            model.setGeometry(googleOverlay);
            model.save({}, {
                success: function (model, response) {
                    //fetch schema...
                    model.fetchUpdateMetadata(function () {
                        //...and render the popup form:
                        model.generateUpdateSchema(model.updateMetadata);
                        that.app.vent.trigger("marker-added", {
                            key: "markers",
                            models: [ model ]
                        });
    
                        // update map overlays to reflect new state:
                        googleOverlay.setMap(null);
                        that.dm.setDrawingMode(null);
                        model.trigger("show-overlay");
                        model.trigger("show-item");
                        model.trigger("show-bubble");
                    });
                }
            });
        };

        this.getMarkerOverlays = function () {
            //TODO: fix hacky fix for drag and drop
            var overlayGroup = this.app.mapRegion.currentView.overlayManager.getMarkerOverlays();
            return overlayGroup.children;
        };

        this.getPointFromPixelPosition = function (e) {
            function elementContainsPoint(domElement, x, y) {
                return x > domElement.offsetLeft && x < domElement.offsetLeft + domElement.offsetWidth &&
                    y > domElement.offsetTop && y < domElement.offsetTop + domElement.offsetHeight;
            }
            var map = this.app.getMap(),
                mapContainer = map.getDiv();
            if (elementContainsPoint(mapContainer, e.pageX, e.pageY)) {
                return new google.maps.Point(e.pageX - mapContainer.offsetLeft,
                        e.pageY - mapContainer.offsetTop);
            }
            return null;
        };

        this.getLatLngFromHtmlDiv = function (e) {
            var point = this.getPointFromPixelPosition(e),
                overlayView = this.app.getOverlayView(),
                projection = overlayView.getProjection(),
                latLng = projection.fromContainerPixelToLatLng(point);
            return latLng;
        };

        this.getIntersectingMarker = function (opts) {
            var activeMarker;
            this.getMarkerOverlays().each(function (marker) {
                if (marker.isShowingOnMap() && marker.intersects(opts.latLng)) {
                    activeMarker = marker;
                    return;
                }
            });
            return activeMarker;
        };

        this.showHtmlDragHighlighting = function (opts) {
            var e = opts.event.originalEvent,
                latLng = this.getLatLngFromHtmlDiv(e);
            if (latLng) {
                this.showDragHighlighting({ latLng: latLng });
            }
        };

        this.showDragHighlighting = function (opts) {
            var that = this,
                intersects = false;
            this.getMarkerOverlays().each(function (marker) {
                if (marker.isShowingOnMap() && marker.intersects(opts.latLng)) {
                    that.highlight(marker);
                    intersects = true;
                }
            });
            if (!intersects) {
                that.unHighlight();
            }
        };

        /**
         * This method controls the geo-referencing of an item from the side panel:
         */
        this.dropItem = function (opts) {
            function elementContainsPoint(domElement, x, y) {
                return x > domElement.offsetLeft && x < domElement.offsetLeft + domElement.offsetWidth &&
                    y > domElement.offsetTop && y < domElement.offsetTop + domElement.offsetHeight;

            }
            var event = opts.event,
                model = opts.model,
                overlayView = this.app.getOverlayView(),
                map = this.app.getMap(),
                e = event.originalEvent,
                mapContainer = map.getDiv(),
                point,
                projection,
                latLng,
                attachingMarker;
            e.stopPropagation();

            if (elementContainsPoint(mapContainer, e.pageX, e.pageY)) {
                point = this.getPointFromPixelPosition(e);
                projection = overlayView.getProjection();
                latLng = projection.fromContainerPixelToLatLng(point);

                //save the data item's geometry:
                model.setGeometry(latLng);
                model.save();

                //attach the data item to the intersecting marker, if applicable:
                if (model.get("overlay_type") != "marker") {
                    attachingMarker = this.getIntersectingMarker({latLng: latLng});
                }
                if (attachingMarker) {
                    attachingMarker.model.attach(
                        model,
                        this.attachSuccessful.bind(this, attachingMarker.model),
                        this.attachUnsuccessful.bind(this, attachingMarker.model)
                    );
                    this.unHighlight(attachingMarker);
                    //debugger;
                    attachingMarker.model.trigger('show-tip-attaching');
                    model.trigger('hide-item hide-overlay');
                } else {
                    //debugger;
                    model.trigger('show-item show-overlay');
                }
            }
        };

        /**
         * This method controls the geo-referencing of an item from 
         * the map:
         */
        this.saveDragChange = function (opts) {
            var model = opts.model,
                latLng = opts.latLng,
                attachingMarker = this.getIntersectingMarker({latLng: latLng});
            if (attachingMarker) {
                this.unHighlight(attachingMarker);
                attachingMarker.model.trigger('show-tip-attaching');
                model.trigger('hide-item reset-overlay');
                attachingMarker.model.attach(
                    model,
                    this.attachSuccessful.bind(this, attachingMarker.model),
                    this.attachUnsuccessful.bind(this, attachingMarker.model)
                );
            } else {
                model.setGeometry(latLng);
                model.save();
            }
        };

        this.attachCallback = function (markerModel, response) {
            markerModel.trigger('hide-tip');
        };

        this.attachSuccessful = function (markerModel) {
            markerModel.fetch({
                success: function () { markerModel.trigger('hide-tip'); },
                error: function () { markerModel.trigger('hide-tip'); }
            });
        };

        this.attachUnsuccessful = function (markerModel) {
            markerModel.trigger('hide-tip');
        };

        //call initialization function:
        this.initialize(opts, basemap);
    };
    //extend prototype so that this function is visible to the CORE:
    _.extend(GeoreferenceManager.prototype, {
        destroy: function () {
            this.hide();
        }
    });
    return GeoreferenceManager;
});