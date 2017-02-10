define(["marionette",
        "handlebars",
        "apps/gallery/views/media_browser",
        "apps/gallery/views/uploader",
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
                     //   "click .hide-button" : "moveLeftPanel",
                     //   "click .edit" : "showRightPanel",
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

                this.mb = new MediaBrowserView({ app: this.app });
                this.mediaBrowserRegion.show(this.mb);
                
                
                
            },
            addModels: function () {
                this.mb.addModels()
            }
       
        });
        return AddMediaModal;
    });
