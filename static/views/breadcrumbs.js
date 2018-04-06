define([
    "underscore",
    "handlebars",
    "marionette",
    "lib/modals/modal",
    "views/generate-print",
    "text!../templates/breadcrumbs.html"
], function (_, Handlebars, Marionette,
             Modal, PrintLayoutView, BreadcrumbsTemplate) {
    "use strict";
    var Toolbar = Marionette.ItemView.extend({
        template: Handlebars.compile(BreadcrumbsTemplate),
        initialize: function (opts) {
            _.extend(this, opts);
            this.modal = this.app.modal;
            if (!this.activeMap && this.collection.length > 0) {
                this.activeMap = this.collection.at(0);
            }
            this.listenTo(this.app.vent, 'route-map', this.getSelectedMap);
            this.listenTo(this.collection, 'add', this.render);
        },
        templateHelpers: function () {
            return {
                mapList: this.collection.toJSON(),
                name: this.model.get("name"),
                screenType: this.app.screenType,
                map: this.activeMap ? this.activeMap.get("name") : null
            };
        },

        events: {
            'click #map-menu': 'showMapList',
            'click #map-list': 'hideMapList',
            'click .add-map': "triggerAddMap"
        },

        triggerAddMap: function (e) {
            alert('open-new-map-modal');
            this.app.vent.trigger('open-new-map-modal');
            if (e) { e.preventDefault(); }
        },
        showMapList: function() {
            this.$el.find('#map-list').toggle();
        },

        hideMapList: function() {
            this.$el.find('#map-list').hide();
        },
        selectMap: function () {
            var id = $(event.target).data('value'),
            map = this.collection.get(id);
            this.setActiveMap(map);
        },
        setInitialModel: function () {
            // on initialize, pass the first model in the collection
            // to be set as the active map
            this.setActiveMap(this.collection.at(0));
            this.render();
        },

        getSelectedMap: function(mapId) {
            console.log('route to map');
            this.setActiveMap(this.collection.get(mapId));
        },
        setActiveMap: function (map) {
            if (this.collection.length == 0) {
                return;
            }
            var selectedMapModel = map,
                that = this;
            this.activeMap = map;
            selectedMapModel.fetch({ success: function () {
                that.setCenterZoom(selectedMapModel);
                that.setMapTypeId(selectedMapModel);
                that.app.vent.trigger("change-map", selectedMapModel);
                that.app.vent.trigger("hide-right-panel");
                that.render();
            }});
        },

        setCenterZoom: function (selectedMapModel) {
            var location = selectedMapModel.getDefaultLocation();
            this.app.basemapView.setCenter(location.center);
            this.app.basemapView.setZoom(location.zoom);
        },

        setMapTypeId: function (selectedMapModel) {
            var skin = selectedMapModel.getDefaultSkin();
            this.app.basemapView.setMapTypeId(skin.basemap);
        },

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
