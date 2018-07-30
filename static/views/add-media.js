define(["marionette",
        "handlebars",
        "views/media_browser",
        "views/create-media",
        "views/create-video",
        "text!templates/media-browser-layout.html",
        "models/layer"
    ],
    function (Marionette, Handlebars, MediaBrowserView, UploaderView,
            VideoLinkView, AddMediaModalTemplate) {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var AddMediaModal = Marionette.LayoutView.extend({
            template: Handlebars.compile(AddMediaModalTemplate),
            activeRegion: null,
            initialize: function (opts) {
                _.extend(this, opts);
                this.render();
                this.showUploader();
            },

            events: {
                'click #upload-tab' : 'showUploader',
                'click #video-tab' : 'showVideoLinker',
                'click #database-tab' : 'showDatabase'
            },

            regions: {
                mainRegion: "#main",
            },

            highlightTab: function (e) {
                this.$el.find("nav > ul > li").removeClass("active");
                if (e) {
                    $(e.target).parent().addClass("active");
                } else {
                    this.$el.find("nav > ul > li:first-child").addClass("active");
                }
            },

            showUploader: function (e) {
                this.activeRegion = "uploader";
                this.mainRegion.show(new UploaderView({
                    app: this.app,
                    parentModel: this.parentModel
                }));
                this.highlightTab(e);
                if (e) {
                    e.preventDefault();
                }
            },

            showVideoLinker: function (e) {
                this.activeRegion = "videoLinker";
                this.mainRegion.show(new VideoLinkView({
                    app: this.app,
                    parentModel: this.parentModel
                }));
                this.highlightTab(e);
                if (e) {
                    e.preventDefault();
                }
            },

            showDatabase: function (e) {
                this.activeRegion = "mediaBrowser";
                this.mainRegion.show(new MediaBrowserView({
                    app: this.app,
                    parentModel: this.parentModel
                }));
                this.highlightTab(e);
                if (e) {
                    e.preventDefault();
                }
            },
            addModels: function () {
                if (this.activeRegion == "mediaBrowser") {
                    this.mb.addModels();
                } else if (this.activeRegion == "uploader") {
                    this.upld.addModels();
                } else if (this.activeRegion == "videoLinker") {
                    this.vdlk.saveModel();
                }
            }
        });
        return AddMediaModal;
    });
