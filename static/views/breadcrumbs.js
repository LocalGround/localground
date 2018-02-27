define([
    "underscore",
    "handlebars",
    "marionette",
    "lib/modals/modal",
    "collections/maps",
    "views/generate-print",
    "text!../templates/breadcrumbs.html"
], function (_, Handlebars, Marionette,
             Modal, Maps, PrintLayoutView, BreadcrumbsTemplate) {
    "use strict";
    var Toolbar = Marionette.ItemView.extend({
        template: Handlebars.compile(BreadcrumbsTemplate),
        previewURL: null,
        templateHelpers: function () {
            var name;
            let mapList;
            if (this.model) {
                console.log(this.model);
                name = this.model.get("name") === "Untitled" ? "" : this.model.get("name");
            }
            if (this.displayMap && this.maps.models[0]) {
                console.log('HAS MAP');
                console.log(this);
                this.currentMap = this.maps.models[0].get('name');
                console.log(this.currentMap);

                mapList = this.maps.models.map(mapModel => {
                    return {
                        name: mapModel.get('name'),
                        id: mapModel.get('id')
                    }
                });
                console.log(mapList);
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
            'click #map-list': 'hideMapList'
        },

        modal: null,

        initialize: function (opts) {
            _.extend(this, opts);
            if (this.app.dataManager) {
                this.model = this.app.dataManager.model;
            }
            this.app.activeTab = "data";
            if (this.app.screenType == "style") {
                this.app.activeTab = "style";
            }

            this.modal = new Modal();

            Marionette.ItemView.prototype.initialize.call(this);
            this.listenTo(this.app.vent, 'data-loaded', this.setModel);
            this.getPreviewMap();
        },

        showMapList: function() {
            this.$el.find('#map-list').toggle();
        },

        hideMapList: function() {
            this.$el.find('#map-list').hide();
        },
 
        getPreviewMap: function () {
            var that = this;
            this.maps = this.app.dataManager.maps;
            // this.maps = new Maps(null, { projectID: this.app.getProjectID() });
            // //this.maps.setServerQuery("WHERE project_id = " + this.app.getProjectID());
            // this.maps.fetch({
            //     reset: true,
            //     success: function (collection) {
            //         if (collection.length > 0) {
            //             that.previewURL = collection.at(0).get("slug");
            //             that.render();
            //         }
            //     }
            // });
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
        },

        setModel: function () {
            this.model = this.app.dataManager.model;
            console.log('set model', this.displayMap);
            this.render();
        }
    });
    return Toolbar;
});
