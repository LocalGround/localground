define([
    "marionette"
], function (Marionette) {
    "use strict";
    return Marionette.Controller.extend({
        initialize: function (options) {
            this.deferredMapID = null;
            this.deferredLayerID = null;
            this.app = options.app;
        },
        displayMap: function (mapId) {
            console.log('map route');
            this.app.vent.trigger('route-map', mapId);
        },

        displayLayer: function(mapId, layerId) {
            this.app.vent.trigger('route-layer', mapId, layerId);
        },

        newMap: function() {
            console.log('new map triggered');
            this.app.vent.trigger('route-new-map');
        },

        newLayer: function (mapID) {
            this.app.vent.trigger('route-new-layer', mapID);
        }
    });
});
