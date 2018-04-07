define([
    "marionette",
    "views/data-detail"
], function (Marionette, DataDetail) {
    "use strict";
    return Marionette.Controller.extend({
        initialize: function (options) {
            this.app = options.app;
            this.dataManager = this.app.dataManager;
        },
        defaultMap: function () {
            //redirect to display first map in list:
            window.location.href= '#/' + this.dataManager.maps.at(0).id;
        },
        displayMap: function (mapId) {
             this.app.vent.trigger('route-map', mapId);
             this.app.vent.trigger('hide-detail');
        },

        displayLayer: function(mapId, layerId) {
            this.app.vent.trigger('route- ', mapId, layerId);
        },

        newLayer: function (mapID) {
            this.app.vent.trigger('route-new-layer', mapID);
        },

        mapHasChanged: function (mapId) {
            return !this.dataManager.getMap() ||
                this.dataManager.getMap().id !== mapId;
        },

        displayDataDetail: function(mapId, layerId, dataSource, markerId) {
            const routeInfo = {
                mapId: parseInt(mapId),
                layerId: parseInt(layerId),
                dataSource: dataSource,
                markerId: parseInt(markerId)
            };
            if (this.mapHasChanged(routeInfo.mapId)) {
                this.app.vent.trigger('route-map', mapId);
            }

            this.app.vent.trigger('show-data-detail', routeInfo);
            this.app.vent.trigger('highlight-symbol-item', routeInfo);
        }
    });
});
