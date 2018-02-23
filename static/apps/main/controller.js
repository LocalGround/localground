define([
    "marionette"
], function (Marionette) {
    "use strict";
    return Marionette.Controller.extend({
        initialize: function (options) {
            this.app = options.app;
        },
        defaultMap: function () {
            console.log('**************************');
            console.log('Load Default Map');
            console.log('**************************');
            this.app.vent.trigger('init-default-map');
        },
        displayMap: function (mapId) {
            console.log('**************************');
            console.log('Load Specific Map: ', mapId);
            console.log('**************************');
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
