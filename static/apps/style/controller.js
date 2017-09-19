define([
    "marionette"
], function (Marionette) {
    "use strict";
    return Marionette.Controller.extend({
        initialize: function (options) {
            this.app = options.app;
        },
        dataDetail: function (dataType, id) {
            this.app.vent.trigger("show-detail", {
                id: id,
                dataType: dataType
            }, false);
        },
        dataList: function (dataType) {
            this.app.vent.trigger("show-list", dataType);
        },
        displayMap: function (mapId) {    
            console.log("display map");       
            this.app.vent.trigger('route-map', mapId); 
        },

        displayLayer: function(mapId, layerId) {
            console.log(mapId, layerId);
            this.displayMap(mapId);
            this.app.vent.trigger('route-layer', mapId, layerId);
        },

        newMap: function() {
            this.app.vent.trigger('route-new-map');
        },
        newLayer: function() {
            this.app.vent.trigger('route-new-layer');
        },

        index: function() {
            console.log("index, hi");
        }
    });
});