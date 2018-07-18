define(['marionette',
        'underscore',
        'handlebars',
        'lib/maps/overlays/marker'
    ],
    function (Marionette, _, Handlebars, MarkerOverlay) {
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
            collectionEvents: {
                'zoom-to-extents': 'zoomToExtents',
                'change:geometry': 'geometryUpdated',
                'show-markers': 'showAll',
                'hide-markers': 'hideAll'
            },

            initialize: function (opts) {
                _.extend(this, opts);
                this.opts = opts;
                this.map = this.app.getMap();
                this.render();

                google.maps.event.addListenerOnce(this.map, 'idle', function () {
                    if (this.opts.startVisible) {
                        this.showAll();
                    }
                }.bind(this));
            },

            childViewOptions: function (model, index) {
                console.log(model);
                console.log(model.get('overlay_type'));
                console.log(this.model);
                console.log(this.model.layerModel);
                return {
                    map: this.map,
                    symbol: this.model,
                    app: this.app,
                    isShowing: this.isShowing,
                    displayOverlay: this.displayOverlays,
                    route: `layers/${this.model.layerModel.id}/${model.get('overlay_type')}/${model.id}`
                };
            },

            geometryUpdated: function (model) {
                if (!this.children.findByModel(model)) {
                    this.addChild(model, this.childView);
                } else if (!model.get("geometry")) {
                    var view = this.children.findByModel(model);
                    this.removeChildView(view);
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

            remove: function () {
                this.hideAll();
                Marionette.CollectionView.prototype.remove.call(this);
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
            },
            onDestroy: function () {
                this.hideAll();
            }

        });
        return MarkerOverlays;
    });
