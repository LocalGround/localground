/**
 * This view's job is as follows:
 * 1. Show a list of available maps
 * 2. If user opts to create a new map, trigger the functionality to create
      one (showAddMapModal).
 * 3. If the user chooses to navigate to a different map, delegate to the Router
 *    to instantiate correct functionality.
*/
define([
    "underscore",
    "handlebars",
    "marionette",
    "models/map",
    "apps/main/views/left/new-map-modal-view",
    "text!../templates/map-menu.html"
], function (_, Handlebars, Marionette, Map, CreateMapForm, MapMenuTemplate) {
    "use strict";
    var MapMenu = Marionette.ItemView.extend({
        template: Handlebars.compile(MapMenuTemplate),
        initialize: function (opts) {
            _.extend(this, opts);
            this.modal = this.app.modal;
            this.popover = this.app.popover;
        },

        className: 'dropdown-menu',

        templateHelpers: function () {
            return {
                mapList: this.collection.toJSON(),
                map: this.activeMap ? this.activeMap.toJSON() : null
            };
        },

        events: {
            'click .add-map': "showAddMapModal"
        },

        showAddMapModal: function (e) {
            var latLng = this.app.basemapView.getCenter();
            var createMapModel = new CreateMapForm({
                app: this.app,
                model: new Map({
                    center: {
                        "type": "Point",
                        "coordinates": [ latLng.lng(), latLng.lat() ]
                    },
                    basemap: this.app.basemapView.getMapTypeId(),
                    zoom: this.app.basemapView.getZoom(),
                    project_id: this.app.getProjectID(),
                    metadata: {
                        displayLegend: true,
                        nextPrevButtons: false,
                        allowPanZoom: true,
                        streetView: true,
                        displayTitleCard: true,
                        titleCardInfo: {
                            header: null,
                            description: null
                        }
                    }
                })
            });

            this.modal.update({
                class: "add-map",
                view: createMapModel,
                title: 'New Map',
                width: 400,
                saveButtonText: "Create Map",
                closeButtonText: "Cancel",
                showSaveButton: true,
                saveFunction: createMapModel.saveMap.bind(createMapModel),
                showDeleteButton: false
            });

            this.modal.show();
            if (e) { e.preventDefault(); }
        }
    });
    return MapMenu;
});
