define([
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/presentation-options.html"
], function (_, Handlebars, Marionette, PresentationOptionsTemplate, ) {
    "use strict";
    var PresentationOptions = Marionette.ItemView.extend({
        template: Handlebars.compile(PresentationOptionsTemplate),
        initialize: function (opts) {
            _.extend(this, opts);
            this.modal = this.app.modal;
            this.popover = this.app.popover;
        },

        className: 'presentation-options',

        templateHelpers: function () {
            return {
                // mapList: this.collection.toJSON(),
                // map: this.activeMap ? this.activeMap.toJSON() : null
            };
        },

        events: {
            // 'click .add-map': "showAddMapModal"
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
                    project_id: this.app.getProjectID()
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
    return PresentationOptions;
});
