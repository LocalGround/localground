define([
    "marionette",
    "views/data-detail"
], function (Marionette, DataDetail) {
    "use strict";
    return Marionette.Controller.extend({
        initialize: function (options) {
            this.app = options.app;
        },
        defaultMap: function () {
            console.log('default map');
            this.app.vent.trigger('init-default-map');
        },
        displayMap: function (mapId) {
             console.log('display map: ', mapId);
            this.app.vent.trigger('route-map', mapId);
        },

        displayLayer: function(mapId, layerId) {
            this.app.vent.trigger('route-layer', mapId, layerId);
        },

        newLayer: function (mapID) {
            this.app.vent.trigger('route-new-layer', mapID);
        },

        mapHasChanged: function (mapId) {
            return !this.app.selectedMapModel || this.app.selectedMapModel.id !== mapId;
        },

        displayDataDetail: function(mapId, layerId, dataSource, markerId) {
            markerId = parseInt(markerId)
            layerId = parseInt(layerId);
            mapId = parseInt(mapId);
            const model = this.app.dataManager.getModel(dataSource, markerId);
            if (this.mapHasChanged(mapId)) {
                console.log('route map from datadetail route');
                this.app.vent.trigger('route-map', mapId);
            }
            model.trigger('highlight-symbol-item', layerId)
            this.app.vent.trigger('show-data-detail', new DataDetail({
                model: model,
                app: this.app
            }));
        }
    });
});
