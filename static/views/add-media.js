define(["marionette",
        "handlebars",
        "views/media_browser",
        "views/create-media",
        "views/create-video",
        "text!templates/media-browser-layout.html",
        "models/layer"
    ],
    function (Marionette, Handlebars,
        MediaBrowserView, UploaderView, VideoLinkView, AddMediaModalTemplate) {
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
                'click #video-tab' : 'showVideoLinker',
                'click #database-tab' : 'showDatabase'
            },

            regions: {
                uploaderRegion: "#uploader",
                videoLinkerRegion: "#video_linker",
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


                // This instantiation must have caused either of the following:

                // Either the overall order caused this to be called first
                // before DataForm ever gets called
                // OR
                // DataForm has been overwritten with an empty undefined value
                //

                // by instantiating the create-video,
                // that is the single code that led to to massive breaking
                // of data form
                this.vdlk = new VideoLinkView({
                    app: this.app,
                    parentModel: this.parentModel
                });

                this.videoLinkerRegion.show(this.vdlk);
                //this.videoLinkerRegion.show(); // leave this empty for testing
                this.videoLinkerRegion.$el.hide();

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
                this.videoLinkerRegion.$el.hide();
                this.uploaderRegion.$el.show();
                this.$el.find("#database-tab-li").removeClass("active");
                this.$el.find("#video-tab-li").removeClass("active");
                this.$el.find("#upload-tab-li").addClass("active");
                this.activeRegion = "uploader";
                if (e) {
                    e.preventDefault();
                }
            },



            showVideoLinker: function (e) {
                this.mediaBrowserRegion.$el.hide();
                this.uploaderRegion.$el.hide();
                this.videoLinkerRegion.$el.show();
                this.$el.find("#database-tab-li").removeClass("active");
                this.$el.find("#upload-tab-li").removeClass("active");
                this.$el.find("#video-tab-li").addClass("active");
                this.activeRegion = "videoLinker";
                if (e) {
                    e.preventDefault();
                }
            },

            showDatabase: function (e) {
                this.uploaderRegion.$el.hide();
                this.videoLinkerRegion.$el.hide();
                this.mediaBrowserRegion.$el.show();
                this.$el.find("#upload-tab-li").removeClass("active");
                this.$el.find("#video-tab-li").removeClass("active");
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
                } else if (this.activeRegion == "videoLinker") {
                    alert("Active Region is Video Linker")
                }
            }
        });
        return AddMediaModal;
    });
