define(['marionette',
        'underscore',
        'lib/maps/overlays/photo',
        'lib/maps/overlays/audio',
        'lib/maps/overlays/marker'
    ],
    function (Marionette, _, PhotoOverlay, AudioOverlay, MarkerOverlay) {
        'use strict';
        /**
         * The top-level view class that harnesses all of the map editor
         * functionality. Also coordinates event triggers across all of
         * the constituent views.
         * @class OverlayGroup
         */
        var MarkerOverlays = Marionette.CollectionView.extend({
            /** A google.maps.Map object */
            map: null,
            /*getChildView: function () {
                var overlayView = null;
                switch (this.dataType) {
                case "photos":
                    overlayView = PhotoOverlay;
                    break;
                case "audio":
                    overlayView = AudioOverlay;
                    break;
                case "markers":
                case /form_/.test(this.dataType):
                    overlayView = MarkerOverlay;
                    break;
                default:
                    overlayView = MarkerOverlay;
                    break;
                }
                return overlayView;
            },*/
            childView: MarkerOverlay,

            initialize: function (opts) {
                _.extend(this, opts);
                this.collection = opts.collection;
                this.opts = opts;
                this.map = this.app.getMap();

                //this.childView = PhotoOverlay;
                this.childViewOptions = opts;

                //listen for new data:
                this.listenTo(this.collection, 'zoom-to-extents', this.zoomToExtents);
                this.listenTo(this.app.vent, "drag-ended", this.saveDragChange);

                this.render();
                //this.zoomToExtent();

                google.maps.event.addListenerOnce(this.map, 'idle', function () {
                    if (this.opts.startVisible) {
                        this.showAll();
                    }
                }.bind(this));
            },

            geometryUpdated: function (model) {
                //create a child view if one doesn't exist (necessary for
                // data elements that have just been geo-referenced)
                if (!this.children.findByModel(model)) {
                    //console.log("creating child view");
                    this.addChild(model, this.childView);
                }
            },

            saveDragChange: function (opts) {
                var model = opts.model,
                    latLng = opts.latLng;
                model.setGeometryFromOverlay(latLng);
                model.save();
            },

            // overriding the "addChild" method so that data elements w/o
            // geometries won't render.
            addChild: function (child, ChildView, index) {
                if (child.get('geometry') != null) {
                    return Marionette.CollectionView.prototype.addChild.call(this, child, ChildView, index);
                }
                return null;
            },

            showAll: function () {
                this.children.each(function (overlay) {
                    overlay.show();
                });
            },

            hideAll: function () {
                //this._isShowingOnMap = false;
                this.children.each(function (overlay) {
                    overlay.hide();
                });
            },

            getBounds: function () {
                var bounds = new google.maps.LatLngBounds();
                this.children.each(function (overlay) {
                    bounds.union(overlay.getBounds());
                });
                return bounds;
            },

            zoomToExtents: function () {
                var bounds = this.getBounds();
                if (!bounds.isEmpty()) {
                    this.map.fitBounds(bounds);
                }
            }

        });
        return MarkerOverlays;
    });
