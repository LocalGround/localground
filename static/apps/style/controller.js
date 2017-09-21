define([
    "marionette"
], function (Marionette) {
    "use strict";
    return Marionette.Controller.extend({
        initialize: function (options) {
            this.deferredMapID = null;
            this.deferredLayerID = null;
            this.app = options.app;
            this.listenTo(this.app.vent, 'data-loaded', this.test)
        },
        isDataLoaded: function () {
            return this.app.dataManager.dataLoaded;
        },
        stashParams: function (mapId, layerId) {
            this.deferredMapID = mapId;
            this.deferredLayerID = layerId;
        },
        test: function () {
            var that = this;
            if (this.deferredLayerID) {
                setTimeout(function () {
                    that.app.router.navigate("//" + that.deferredMapID + "/layers/" + that.deferredLayerID, {trigger: true});
                    delete that.deferredMapID;
                    delete that.deferredLayerID;
                }, 400);
                return;
            }
            setTimeout(function () {
                that.app.router.navigate("//new", {trigger: true});
            }, 400);
        },
        displayMap: function (mapId) {
            console.log("display map");
            this.app.vent.trigger('route-map', mapId);
        },

        displayLayer: function(mapId, layerId) {
            if (!this.isDataLoaded()) {
                this.stashParams(mapId, layerId);
                return
            }
            this.app.vent.trigger('route-layer', mapId, layerId);
        },

        newMap: function() {
            if (!this.isDataLoaded()) {
                this.stashParams();
                return
            }
            this.app.vent.trigger('route-new-map');
        },
        newLayer: function() {
            console.log("newLayer");
            this.app.vent.trigger('route-new-layer');
        },

        index: function() {
            console.log("index, hi");
        }
    });
});
