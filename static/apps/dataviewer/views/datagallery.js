define(["marionette",
        "handlebars",
        "apps/gallery/views/data-list",
        "apps/gallery/views/data-detail",
        "text!../templates/gallery-layout.html",
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
                this.galleryListView = new GalleryListView({
                    app: this.app,
                    collection: this.collection,
                    fields: this.fields
                });
                this.galleryListView.render();
                console.log(this.galleryListView.$el.html());
                this.listRegion.show(this.galleryListView);
            },

            events: {
                'click #upload-tab' : 'showUploader',
                'click #database-tab' : 'showDatabase'
            },

            regions: {
                listRegion: '.gallery-panel',
                detailRegion: '.side-panel'
            }

        });
        return AddMediaModal;
    });
