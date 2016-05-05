define(["marionette",
    "jquery",
    "underscore",
    "lib/maps/overlays/point",
    "lib/maps/overlays/polyline",
    "lib/maps/overlays/polygon",
    "lib/maps/overlays/ground-overlay",
    "lib/maps/overlays/infobubbles/base"
    ], function (Marionette, $, _, Point, Polyline, Polygon, GroundOverlay, Infobubble) {
    "use strict";
    /**
     * This class controls the rendering and underlying
     * visibility of Google overlay objects, including points,
     * lines, and polygons
     * @class Overlay
     */
    var Base = Marionette.ItemView.extend({

        map: null,
        model: null,
        _overlay: null,
        template: false,
        infoBubble: null,

        modelEvents: {
            'change:geometry': 'updateOverlay',
            'change': 'render',
            'show-overlay': 'show',
            'hide-overlay': 'hide',
            'zoom-to-overlay': 'zoomTo',
            'reset-overlay': 'restoreModelGeometry'
        },
        /** called when object created */
        initialize: function (opts) {
            this.app = opts.app;
            this.id = this.model.get('overlay_type') + this.model.get('id');
            $.extend(this, this.restoreState());
            this.map = opts.app.getMap();
            this.model = opts.model;
            this.initInfoBubble(opts);
            this.initOverlayType(this.state._isShowingOnMap);
            this.listenTo(this.app.vent, "mode-change", this.changeMode);
        },

        initInfoBubble: function (opts) {
            this.infoBubble = new Infobubble(_.extend({overlay: this}, opts));
        },

        updateOverlay: function () {
            this.getGoogleOverlay().setMap(null);
            this.initOverlayType(this.state._isShowingOnMap);
            this.changeMode();
        },

        initOverlayType: function (isShowingOnMap) {
            var geoJSON = this.model.get("geometry"),
                opts = {
                    model: this.model,
                    map: this.map,
                    isShowingOnMap: isShowingOnMap
                };
            if (geoJSON.type === 'Point') {
                this._overlay = new Point(this.app, opts);
            } else if (geoJSON.type === 'LineString') {
                this._overlay = new Polyline(this.app, opts);
            } else if (geoJSON.type === 'Polygon') {
                if (this.model.get("overlay_type") == "map-image") {
                    this._overlay = new GroundOverlay(this.app, opts);
                } else {
                    this._overlay = new Polygon(this.app, opts);
                }
            } else {
                alert('Unknown Geometry Type');
            }

            this.attachEventHandlers();
        },

        attachEventHandlers: function () {
            var that = this;
            //attach click event:
            google.maps.event.addListener(this.getGoogleOverlay(), 'click', function () {
                that.showBubble();
            });
            //attach mouseover event:
            google.maps.event.addListener(this.getGoogleOverlay(), 'mouseover', function () {
                that.infoBubble.showTip();
            });
            //attach mouseout event:
            google.maps.event.addListener(this.getGoogleOverlay(), 'mouseout', function () {
                that.model.trigger("hide-tip");
            });
        },

        /** shows info bubble (gets overrided in the child class). */
        showBubble: function () {
            this.infoBubble.showBubble();
        },

        /** determines whether the overlay is visible on the map. */
        isShowingOnMap: function () {
            return this.getGoogleOverlay().getMap() != null && this.state._isShowingOnMap;
        },

        /** shows the google.maps overlay on the map. */
        show: function () {
            if (this.model.get("isVisible")) {
                var go = this.getGoogleOverlay();
                go.setMap(this.map);
                this.changeMode();
                this.state._isShowingOnMap = true;
                this.saveState();
            }
        },

        render: function () {
            if (this.state._isShowingOnMap && this.model.get('isVisible')) {
                this.redraw();
                this.show();
            } else {
                this.hide();
            }
        },


        /** hides the google.maps overlay from the map. */
        hide: function () {
            var go = this.getGoogleOverlay();
            go.setMap(null);
            this.model.trigger("hide-bubble");
            this.state._isShowingOnMap = false;
            this.saveState();
        },

        saveState: function () {
            this.app.saveState(this.id, {
                _isShowingOnMap: this.state._isShowingOnMap
            });
        },

        restoreState: function () {
            this.state = this.app.restoreState(this.id);
            if (!this.state) {
                this.state = { _isShowingOnMap: false };
            }
        },

        onBeforeDestroy: function () {
            var go = this.getGoogleOverlay();
            this.infoBubble.remove();
            go.setMap(null);
            Base.__super__.remove.apply(this);
        },

        /********************************************************/
        /** DELEGATED METHODS ***********************************/
        /********************************************************/

        /**
         * Returns the overlay's googleOverlay
         * @returns {Object}
         * Either a google.maps.Marker, google.maps.Polyline,
         * google.maps.Polygon, or google.maps.GroundOverlay
         */
        getGoogleOverlay: function () {
            return this._overlay._googleOverlay;
        },

        /** zooms to the google.maps overlay. */
        zoomTo: function () {
            //this._overlay.zoomTo();
            //show bubble already zooms to overlay:
            this.showBubble();
        },

        /** centers the map at the google.maps overlay */
        centerOn: function () {
            this._overlay.centerOn();
        },

        /**
         * Delegates to underlying geometry.
         * @returns {google.maps.LatLng} object
         */
        getCenter: function () {
            return this._overlay.getCenter();
        },

        getBounds: function () {
            return this._overlay.getBounds();
        },

        changeMode: function () {
            if (this.app.getMode() === "view") {
                this.makeViewable();
            } else {
                this.makeEditable();
            }
        },

        makeViewable: function () {
            this._overlay.makeViewable();
        },

        makeEditable: function () {
            this._overlay.makeEditable(this.model);
        },

        redraw: function () {
            //implement in child class
        },

        getShapeType: function () {
            return this._overlay.getShapeType();
        },

        intersects: function (latLng) {
            return this._overlay.intersects(latLng);
        },

        restoreModelGeometry: function () {
            this._overlay.restoreModelGeometry();
        }

    });
    return Base;
});