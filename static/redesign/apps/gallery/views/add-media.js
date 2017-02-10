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
            initialize: function (opts) {
                this.app = opts.app;
                this.render();
               // this.listenTo(this.app.vent, 'change-map', this.handleNewMap);
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

                var upld = new UploaderView({ app: this.app });
                this.uploaderRegion.show(upld);
                this.uploaderRegion.$el.hide();

                var mb = new MediaBrowserView({ app: this.app });
                this.mediaBrowserRegion.show(mb);

            },

            showUploader: function() {
                this.mediaBrowserRegion.$el.hide();

                this.uploaderRegion.$el.show();
/*
                var upld = new UploaderView({ app: this.app });
                this.uploaderRegion.show(upld);
*/

            },

            showDatabase: function() {
                this.uploaderRegion.$el.hide();

                this.mediaBrowserRegion.$el.show();
            /*
                var mb = new MediaBrowserView({ app: this.app });
                this.mediaBrowserRegion.show(mb);
            */
            }
       
        });
        return AddMediaModal;
    });
