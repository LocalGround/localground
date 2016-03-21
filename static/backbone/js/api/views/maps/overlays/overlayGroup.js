define(['marionette',
        'config',
        'jquery',
        'underscore'
    ],
    function (Marionette, Config, $, _) {
        'use strict';
        /**
         * The top-level view class that harnesses all of the map editor
         * functionality. Also coordinates event triggers across all of
         * the constituent views.
         * @class OverlayGroup
         */
        var OverlayGroup = Marionette.CollectionView.extend({
            /** A google.maps.Map object */
            map: null,

            initialize: function (opts) {
                $.extend(this, opts);
                this.collection = opts.collection;
                var configKey = this.collection.key;
                if (configKey.indexOf("form_") != -1) {
                    configKey = configKey.split("_")[0];
                }
                this.opts = opts;
                this.map = this.app.getMap();
                this.key = this.collection.key;
                this.childView = Config[configKey].Overlay;
                this.childViewOptions = _.extend({}, opts, {
                    infoBubbleTemplates: {
                        InfoBubbleTemplate: _.template(Config[configKey].InfoBubbleTemplate),
                        TipTemplate: _.template(Config[configKey].TipTemplate)
                    }
                });

                //listen for new data:
                this.listenTo(this.collection, 'zoom-to-extent', this.zoomToExtent);
                this.listenTo(this.collection, 'change:geometry', this.geometryUpdated);

                //Have to manually render since this is an abstract view
                //attached to map elements rather than the DOM
                this.render();
                //If we want everything to default to visible (say, we are loading a view),
                //Display it once the map is loaded
                //TODO: think of a better place to put this map interaction
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

            // overriding the "addChild" method so that data elements whose geometry hasn't
            // yet been defined won't render.
            addChild: function (child, ChildView, index) {
                if (child.get('geometry') != null) {
                    return Marionette.CollectionView.prototype.addChild.call(this, child, ChildView, index);
                }
                return null;
            },

            /** Shows all of the map overlays */
            showAll: function () {
                //this._isShowingOnMap = true;
                this.children.each(function (overlay) {
                    if (overlay.model.get("isVisible")) {
                        overlay.show();
                    }
                });
            },

            /** Hides all of the map overlays */
            hideAll: function () {
                //this._isShowingOnMap = false;
                this.children.each(function (overlay) {
                    overlay.hide();
                });
            },

            /** Zooms to the extent of the collection */
            zoomToExtent: function () {
                //console.log("zoom to extent");
                var bounds = new google.maps.LatLngBounds();
                this.children.each(function (overlay) {
                    bounds.union(overlay.getBounds());
                });
                this.map.fitBounds(bounds);
            }

        });
        return OverlayGroup;
    });
