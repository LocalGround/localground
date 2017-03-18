define([
    "marionette",
    "underscore",
    "views/profile/filterView",
    "views/profile/listEditView",
    "views/profile/sideBarView",
    "collections/photos",
    "collections/audio",
    "collections/mapimages",
    "collections/prints",
    "collections/projects",
    "text!../templates/profile/photo-item-edit.html",
    "text!../templates/profile/item_audio.html",
    "text!../templates/profile/item_map_image.html",
    "text!../templates/profile/item_print.html",
    "text!../templates/profile/item_project.html",
    "text!../templates/profile/photo-item-view.html",
    "text!../templates/profile/item_audio_readonly.html",
    "text!../templates/profile/item_map_image_readonly.html",
    "text!../templates/profile/item_print_readonly.html",
    "text!../templates/profile/item_project_readonly.html",
    "lib/appUtilities",
    "text!../templates/profile/photoListView.html"
], function (Marionette, _, FilterView, ListEditView, SideBarView,
             Photos, Audio, MapImages, Prints, Projects,
             PhotoItemEditTemplate, AudioItemEditTemplate, MapImageItemEditTemplate, PrintItemEditTemplate, ProjectItemEditTemplate,
             PhotoItemTemplate, AudioItemTemplate, MapImageItemTemplate, PrintItemTemplate, ProjectItemTemplate,
             appUtilities, ListViewTemplate) {
    "use strict";
    var ProfileApp = Marionette.Application.extend(appUtilities);
    ProfileApp = ProfileApp.extend({
        mode: "thumb",
        objectType: "photos",
        regions: {
            filterRegion: "#region1",
            mainRegion: "#region2",
            sideBarRegion : "#region3"
        },
        start: function (options) {
            this.options = options;
            this.options.app = this;
            this.config = {
                photos: {
                    objectType: "photos",
                    collection: new Photos(),
                    EditItemTemplate: PhotoItemEditTemplate,
                    ItemTemplate: PhotoItemTemplate,
                    metadata: options.photoMetadata
                },
                audio: {
                    objectType: "audio",
                    collection: new Audio(),
                    EditItemTemplate: AudioItemEditTemplate,
                    ItemTemplate: AudioItemTemplate,
                    metadata: options.audioMetadata
                },
                "map-images": {
                    objectType: "map-images",
                    collection: new MapImages(),
                    EditItemTemplate: MapImageItemEditTemplate,
                    ItemTemplate: MapImageItemTemplate,
                    metadata: options.mapImageMetadata
                },
                prints: {
                    objectType: "prints",
                    collection: new Prints(),
                    EditItemTemplate: PrintItemEditTemplate,
                    ItemTemplate: PrintItemTemplate,
                    metadata: options.printMetadata
                },
                projects: {
                    objectType: "projects",
                    collection: new Projects(),
                    EditItemTemplate: ProjectItemEditTemplate,
                    ItemTemplate: ProjectItemTemplate,
                    metadata: options.projectUpdateMetadata
                }
            };

            // create child views:
            this.filterView = new FilterView(options);
            
            this.mainView = new ListEditView(_.extend({}, this.options, this.config.photos));
            this.sideBarView = new SideBarView(options);
            //this.listView  = new ListEditView(_.extend({}, this.options, this.config.photos));

            // inject them into the regions:
            this.filterRegion.show(this.filterView);
            this.mainRegion.show(this.mainView);
            this.sideBarRegion.show(this.sideBarView);

            // initialize some AJAX helpers (from appUtilities library)
            this.initAJAX(options);

            //attach event handlers:
            this.config.photos.ItemTemplate = ListViewTemplate;
            this.vent.on("show-list-view", this.showListView, this);
            this.vent.on("apply-filter", this.applyFilter, this);
            this.vent.on("clear-filter", this.clearFilter, this);
        },
        showListView: function () {
            // create an opts that passes in the selected collection,
            // metadata, & templates:
            this.config.photos.ItemTemplate = ListViewTemplate;
            var opts = _.extend({}, this.options, this.config[this.objectType]);

            //re-render mainView with new dataType:
            this.mainView = new ListEditView(opts);
            this.mainRegion.show(this.mainView);
        },
        applyFilter: function (params) {
            var key;
            // apply filter for all collections...
            for (key in this.config) {
                this.config[key].collection.setServerQuery(params);
            }
            // ...but only re-query the active collection:
            this.config[this.objectType].collection.fetch({reset: true});
        },
        clearFilter: function () {
            var key;
            // clear filter for all collections...
            for (key in this.config) {
                this.config[key].collection.clearServerQuery();
            }
            // ...but only re-query the active collection:
            this.config[this.objectType].collection.fetch({reset: true});
        }
    });

    return ProfileApp;
});
