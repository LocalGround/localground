define(['marionette',
        'jquery',
        'lib/maps/overlays/photo',
        'lib/maps/overlays/audio'
    ],
    function (Marionette, $, PhotoOverlay, AudioOverlay) {
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
            getChildView: function () {
                if (this.app.dataType == "photos") {
                    return PhotoOverlay;
                } else if (this.app.dataType == "audio") {
                    return AudioOverlay;
                } else {
                    alert("dataType not handled");
                }
            },

            initialize: function (opts) {
                console.log("making marker overlays...");
                $.extend(this, opts);
                this.collection = opts.collection;
                this.opts = opts;
                this.map = this.app.getMap();

                //this.childView = PhotoOverlay;
                this.childViewOptions = opts;

                //listen for new data:
                this.listenTo(this.collection, 'zoom-to-extent', this.zoomToExtent);
                this.listenTo(this.collection, 'change:geometry', this.geometryUpdated);

                this.render();
                this.zoomToExtent();

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
                    overlay.show();
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
        return MarkerOverlays;
    });
