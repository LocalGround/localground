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
            this.modal = new Modal();
            this.listenTo(this.collection, 'add', this.render);
        },
        templateHelpers: function () {
            var name;
            let mapList;
            if (this.model) {
                name = this.model.get("name") === "Untitled" ? "" : this.model.get("name");
            }
            if (this.displayMap && this.collection.models[0]) {
                this.currentMap = this.collection.models[0].get('name');
                mapList = this.collection.models.map(mapModel => {
                    return {
                        name: mapModel.get('name'),
                        id: mapModel.get('id')
                    }
                });
            }

            return {
                mapList: mapList || null,
                name: name,
                screenType: this.app.screenType,
                map: this.currentMap,
            };
        },

        events: {
            'click #map-menu': 'showMapList',
            'click #map-list': 'hideMapList',
            'click .add-map': "triggerAddMap"
        },

        modal: null,

        triggerAddMap: function (e) {
            this.app.vent.trigger('open-new-map-modal');
            if (e) { e.preventDefault(); }
        },
        showMapList: function() {
            this.$el.find('#map-list').toggle();
        },

        hideMapList: function() {
            this.$el.find('#map-list').hide();
        },

        showModal: function (opts) {
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
