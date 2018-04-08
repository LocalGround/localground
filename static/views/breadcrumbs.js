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
    "views/generate-print",
    "apps/main/views/left/new-map-modal-view",
    "text!../templates/breadcrumbs.html"
], function (_, Handlebars, Marionette, Map, PrintLayoutView,
        CreateMapForm, BreadcrumbsTemplate) {
    "use strict";
    var Toolbar = Marionette.ItemView.extend({
        template: Handlebars.compile(BreadcrumbsTemplate),
        initialize: function (opts) {
            _.extend(this, opts);
            this.modal = this.app.modal;
            this.listenTo(this.collection, 'add', this.render);
        },
        templateHelpers: function () {
            return {
                mapList: this.collection.toJSON(),
                name: this.model.get("name"),
                map: this.activeMap ? this.activeMap.get("name") : null
            };
        },

        events: {
            'click #map-menu': 'showMapList',
            'click #map-list': 'hideMapList',
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
                    basemap: this.app.getMapTypeId(),
                    zoom: this.app.getZoom(),
                    project_id: this.app.getProjectID()
                })
            });

            this.modal.update({
                class: "add-map",
                view: createMapModel,
                title: 'New Map',
                width: 600,
                saveButtonText: "Create Map",
                closeButtonText: "Cancel",
                showSaveButton: true,
                saveFunction: createMapModel.saveMap.bind(createMapModel),
                showDeleteButton: false
            });
            this.modal.show();
            if (e) { e.preventDefault(); }
        },

        showMapList: function() {
            this.$el.find('#map-list').show();
        },

        hideMapList: function() {
            this.$el.find('#map-list').hide();
        },

        //TODO: come back to this. Where does the print button go?
        showPrintModal: function (opts) {
            var printLayout = new PrintLayoutView({
                app: this.app
            });
            this.modal.update({
                app: this.app,
                view: printLayout,
                title: 'Generate Print',
                saveButtonText: 'Print',
                width: 1000,
                height: null,
                closeButtonText: "Done",
                showSaveButton: true,
                showDeleteButton: false,
                saveFunction: printLayout.callMakePrint.bind(printLayout)
            });
            this.modal.show();
        }
    });
    return Toolbar;
});
