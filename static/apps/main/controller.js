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
        displayDataDetail: function(mapId, layerId, dataSource, markerId) {
            const routeInfo = {
                mapId: parseInt(mapId), 
                layerId: parseInt(layerId),
                dataSource: parseInt(dataSource), 
                markerId: parseInt(markerId)
            };
            if (!this.app.selectedMapModel || this.app.selectedMapModel.id !== routeInfo.mapId) {
                console.log('route map from datadetail route');
                this.app.vent.trigger('route-map', mapId);
            }
            
            this.app.screenType = 'map';
            this.app.dataType = dataSource;
            let detailView = new DataDetail({
                model: this.app.dataManager.getModel(dataSource, parseInt(markerId)),
                app: this.app
            });

            this.app.vent.trigger('show-data-detail', detailView, routeInfo);
            // setTimeout(() => {
            //     this.app.vent.trigger('highlight-symbol-item', routeInfo)
            // }, 1000);
            this.app.vent.trigger('highlight-symbol-item', routeInfo);
        }
    });
});
