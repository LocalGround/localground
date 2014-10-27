define(["underscore", "jquery", "models/marker", "config"], function (_, $, Marker, Config) {
    "use strict";
    /**
     * Class that lets a user delete a selected vertex of a path.
     * @class DrawingManager
     * @param {options} opts
     *
     */
    var DrawingManager = function (opts) {
        this.dm = null;
        this.polygonOptions = {
            strokeWeight: 0,
            fillOpacity: 0.45,
            editable: true
        };
        this.polylineOptions = {
            editable: true
        };
        this.markerOptions = {
            draggable: true,
            icon: {
                fillColor: '#999',
                strokeColor: "#FFF",
                strokeWeight: 1.5,
                fillOpacity: 1,
                path: 'M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z',
                scale: 1.6,
                anchor: new google.maps.Point(16, 30),      // anchor (x, y)
                size: new google.maps.Size(15, 30),         // size (width, height)
                origin: new google.maps.Point(0, 0)        // origin (x, y)
            }
        };

        this.initialize = function (opts) {
            this.app = opts.app;
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
					//hide the temporary overlay and show the permenanant one:
                    googleOverlay.setMap(null);
                    that.dm.setDrawingMode(null);

                    //show the edit form:
                    that.showEditForm(model, response);
                }
            });
        };

        this.showEditForm = function (model, response) {
            model.generateUpdateSchema(response.update_metadata);
            var opts = Config.markers;
            $.extend(opts, {
                key: "markers",
                models: [ model ]
            });

            //notify the dataManager that a new data element has been added:
            this.app.vent.trigger("marker-added", opts);

            //shows the overlay and the bubble on the map
            model.trigger("show-overlay");
            model.trigger("show-item");
            model.trigger("show-bubble");

        };

        //call initialization function:
        this.initialize(opts);
    };


    //extend prototype so that this function is visible to the CORE:
    _.extend(DrawingManager.prototype, {
        destroy: function () {
            this.hide();
        }
    });
    return DrawingManager;
});