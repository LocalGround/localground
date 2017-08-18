define(["marionette",
        "handlebars",
        "apps/gallery/views/data-list",
        "apps/gallery/views/data-detail",
        "text!templates/gallery-layout.html",
        "models/layer"
    ],
    function (Marionette, Handlebars, GalleryListView, GalleryDetail, AddMediaModalTemplate)  {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var AddMediaModal = Marionette.LayoutView.extend({
            template: Handlebars.compile(AddMediaModalTemplate),
            activeRegion: null,
            initialize: function (opts) {
                _.extend(this, opts);
                this.render();
            },

            events: {
                'click #upload-tab' : 'showUploader',
                'click #database-tab' : 'showDatabase'
            },

            regions: {
                listRegion: '.gallery-panel',
                detailRegion: '.side-panel'
            },
            onRender: function () {
                // only load views after the LayoutView has
                // been rendered to the screen:

               /* var upld = new SelectMapView({ app: this.app });
                this.menu.show(upld);
                */
                this.upld = new UploaderView({
                    app: this.app,
                    parentModel: this.parentModel
                });
                this.uploaderRegion.show(this.upld);
                this.uploaderRegion.$el.hide();

                this.mb = new MediaBrowserView({
                    app: this.app,
                    parentModel: this.parentModel
                });
                this.mediaBrowserRegion.show(this.mb);
                this.$el.find("#database-tab-li").addClass("active");

                //sets proper region from which to call addModel()
                this.activeRegion = "mediaBrowser";


            },

            showUploader: function (e) {
                this.mediaBrowserRegion.$el.hide();
                this.uploaderRegion.$el.show();
                this.$el.find("#database-tab-li").removeClass("active");
                this.$el.find("#upload-tab-li").addClass("active");
                this.activeRegion = "uploader";
                if (e) {
                    e.preventDefault();
                }
            },

            showDatabase: function (e) {
                this.uploaderRegion.$el.hide();
                this.mediaBrowserRegion.$el.show();
                this.$el.find("#upload-tab-li").removeClass("active");
                this.$el.find("#database-tab-li").addClass("active");
                this.activeRegion = "mediaBrowser";
                if (e) {
                    e.preventDefault();
                }
            },
            addModels: function () {
                if (this.activeRegion == "mediaBrowser") {
                    console.log("read mb.addModels()");
                    this.mb.addModels();
                } else if (this.activeRegion == "uploader") {
                    this.upld.addModels();
                }
            }
        });
        return AddMediaModal;
    });
