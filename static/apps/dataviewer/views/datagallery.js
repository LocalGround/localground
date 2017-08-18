define(["marionette",
        "handlebars",
        "apps/gallery/views/data-list",
        "apps/gallery/views/data-detail",
        "text!../templates/gallery-layout.html",
        "models/layer"
    ],
    function (Marionette, Handlebars, GalleryListView, GalleryDetail, GalleryLayoutTemplate)  {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var AddMediaModal = Marionette.LayoutView.extend({
            className: 'dataview',
            regions: {
                listRegion: '.gallery-panel',
                detailRegion: '.side-panel'
            },
            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(GalleryLayoutTemplate),
                this.render();
            },
            onRender: function () {
              this.galleryListView = new GalleryListView({
                  app: this.app,
                  collection: this.collection,
                  fields: this.fields
              });
              this.listRegion.show(this.galleryListView);
            },

            events: {
                'click #upload-tab' : 'showUploader',
                'click #database-tab' : 'showDatabase'
            }

        });
        return AddMediaModal;
    });
