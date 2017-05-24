define(['marionette',
        'underscore',
        'lib/maps/overlays/marker'
    ],
    function (Marionette, _, MarkerOverlay) {
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
            childView: MarkerOverlay,

            initialize: function (opts) {
                _.extend(this, opts);
                this.collection = opts.collection;
                this.opts = opts;
                this.map = this.app.getMap();
                this.childViewOptions = opts;

                //listen for new data:
                this.listenTo(this.collection, 'zoom-to-extents', this.zoomToExtents);
                this.listenTo(this.collection, 'change:geometry', this.geometryUpdated);
                this.listenTo(this.collection, 'show-markers', this.showAll);
                this.listenTo(this.collection, 'hide-markers', this.hideAll);

                this.render();

                google.maps.event.addListenerOnce(this.map, 'idle', function () {
                    if (this.opts.startVisible) {
                        this.showAll();
                    }
                }.bind(this));
            },

            geometryUpdated: function (model) {
                if (!this.children.findByModel(model)) {
                    this.addChild(model, this.childView);
                    console.log("Adding child");
                }
                else if (!model.get("geometry")){
                    var view = this.children.findByModel(model);
                    this.removeChildView(view);
                    console.log("Removing child");
                }

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
