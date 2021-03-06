define(["marionette",
        "handlebars",
        "apps/dataviewer/gallery/views/data-list",
        "text!../templates/gallery-layout.html"
    ],
    function (Marionette, Handlebars, DataList, GalleryLayoutTemplate)  {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var AddMediaModal = Marionette.LayoutView.extend({
            className: 'main-panel dataview',//className: 'dataview',
            currentCollection: null,
            regions: {
                listRegion: '.gallery-panel',
                detailRegion: '.side-panel'
            },
            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(GalleryLayoutTemplate);
                this.listenTo(this.app.vent, 'show-detail', this.showDataDetail);
                this.listenTo(this.app.vent, 'hide-detail', this.hideMediaDetail);
            },
            onRender: function () {
              this.galleryListView = new DataList({
                  app: this.app,
                  collection: this.collection,
                  fields: this.fields
              });
              this.listRegion.show(this.galleryListView);
            },

            showDataDetail: function (view) {
                this.detailView = view;
                this.detailRegion.show(view);
            },

            showMediaList: function (dataType) {
                var collection = this.dataManager.getCollection(dataType);
                this.dataType = dataType;
                this.saveAppState();
                this.currentCollection = collection;
                this.mainView = new DataList({
                    app: this,
                    collection: this.currentCollection,
                    fields: collection.fields
                });
                this.galleryRegion.show(this.mainView);
                this.hideMediaDetail();
            },


            hideMediaDetail: function () {
                if (this.detailView) {
                    this.detailView.doNotDisplay();
                }
            },

            saveAppState: function () {
                this.saveState("dataView", {
                    dataType: this.dataType
                }, true);
            },
            restoreAppState: function () {
                var state = this.restoreState("dataView");
                if (state) {
                    this.dataType = state.dataType;
                } else if (this.dataManager) {
                    this.dataType = this.dataManager.getDataSources()[1].value;
                }
            }

        });
        return AddMediaModal;
    });
