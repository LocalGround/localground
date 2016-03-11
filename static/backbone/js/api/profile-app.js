define([
    "marionette",
    "underscore",
    "views/profile/filterView",
    "views/profile/listEditView",
    "views/profile/sideBarView",
    "collections/photos",
    "collections/audio",
    "collections/mapimages",
    "text!../templates/profile/item_photo.html",
    "text!../templates/profile/item_audio.html",
    "text!../templates/profile/item_map_image.html",
    "text!../templates/profile/item_photo_readonly.html",
    "text!../templates/profile/item_audio_readonly.html",
    "text!../templates/profile/item_map_image_readonly.html",
    "lib/appUtilities"
], function (Marionette, _, FilterView, ListEditView, SideBarView,
             Photos, Audio, MapImages,
             PhotoItemEditTemplate, AudioItemEditTemplate, MapImageItemEditTemplate,
             PhotoItemTemplate, AudioItemTemplate, MapImageItemTemplate,
             appUtilities) {
    "use strict";
    var ProfileApp = new Marionette.Application(_.extend(appUtilities, {
        mode: "view",
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
                }
            };

            // create child views:
            this.filterView = new FilterView(options);
            this.mainView = new ListEditView(_.extend({}, this.options, this.config.photos));
            this.sideBarView = new SideBarView(options);

            // inject them into the regions:
            this.filterRegion.show(this.filterView);
            this.mainRegion.show(this.mainView);
            this.sideBarRegion.show(this.sideBarView);

            // initialize some AJAX helpers (from appUtilities library)
            this.initAJAX(options);

            //attach event handlers:
            this.vent.on("show-list-view", this.showListView, this);
            this.vent.on("apply-filter", this.applyFilter, this);
            this.vent.on("clear-filter", this.clearFilter, this);
        },
        showListView: function () {
            // create an opts that passes in the selected collection,
            // metadata, & templates:
            var opts = _.extend({}, this.options, this.config[this.objectType]);
            this.mainRegion.show(new ListEditView(opts));
        },
        applyFilter: function (params) {
            var parameters = params,
                key;
            // apply filter for all collections...
            for (key in this.config) {
                this.config[key].collection.setServerQuery(parameters);
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
    }));

    return ProfileApp;
});
