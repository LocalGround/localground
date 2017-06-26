define(["marionette",
        "handlebars",
        "apps/gallery/views/media_browser",
     //   "apps/gallery/views/media-browser-uploader",
        "apps/gallery/views/create-media",
        "text!../templates/media-browser-layout.html",
        "models/layer"
    ],
    function (Marionette, Handlebars, MediaBrowserView, UploaderView, AddMediaModalTemplate)  {
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
                uploaderRegion: "#uploader",
                mediaBrowserRegion: "#media_browser"
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

            showUploader: function() {
                this.mediaBrowserRegion.$el.hide();
                this.uploaderRegion.$el.show();
                this.$el.find("#database-tab-li").removeClass("active");
                this.$el.find("#upload-tab-li").addClass("active");
                this.activeRegion = "uploader";
            },

            showDatabase: function() {
                this.uploaderRegion.$el.hide();
                this.mediaBrowserRegion.$el.show();
                this.$el.find("#upload-tab-li").removeClass("active");
                this.$el.find("#database-tab-li").addClass("active");
                this.activeRegion = "mediaBrowser";
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
