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

            showUploader: function (e) {
                this.currentView = new UploaderView({
                    app: this.app,
                    parentModel: this.parentModel
                });
                this.showView(e);
            },

            showVideoLinker: function (e) {
                this.currentView = new VideoLinkView({
                    app: this.app,
                    parentModel: this.parentModel
                });
                this.showView(e);
            },

            showDatabase: function (e) {
                this.currentView = new MediaBrowserView({
                    app: this.app,
                    parentModel: this.parentModel
                });
                this.showView(e);
            },

            showView: function (e) {
                this.mainRegion.show(this.currentView);
                this.highlightTab(e);
                if (e) {
                    e.preventDefault();
                }
            },

            highlightTab: function (e) {
                this.$el.find("nav > ul > li").removeClass("active");
                if (e) {
                    $(e.target).parent().addClass("active");
                } else {
                    this.$el.find("nav > ul > li:first-child").addClass("active");
                }
            },

            addModels: function () {
                this.currentView.addModels();
            }
        });
        return AddMediaModal;
    });
