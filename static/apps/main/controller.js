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
            console.log('displayDataDetail', mapId, layerId, dataSource, markerId);
            console.log(this);
            
            if (!this.app.selectedMapModel || this.app.selectedMapModel.id !== mapId) {
                console.log('route map from datadetail route');
                this.app.vent.trigger('route-map', mapId); 
            }
            const routeInfo = {mapId, layerId, dataSource, markerId};
            this.app.screenType = 'map';
            this.app.dataType = dataSource;
            console.log(routeInfo);
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
