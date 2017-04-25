define(["marionette",
        "handlebars",
        "models/map",
        "collections/maps",
        "apps/style/views/left/new-map-modal-view",
        "text!../../templates/left/select-map.html",
        "lib/modals/modal"
    ],
    function (Marionette, Handlebars, Map, Maps, NewMap, MapTemplate, Modal) {
        'use strict';

        var SelectMapView = Marionette.ItemView.extend({
            isShowing: true,
            template: Handlebars.compile(MapTemplate),

            events: {
                'change #map-select': 'changeMap',
                'click .add-map': 'showAddMapModal',
                'click .hide-panel': 'hideSection',
                'click .show-panel': 'showSection'
            },
            modal: null,

            initialize: function (opts) {
                var that = this;
                _.extend(this, opts);
                this.restoreState();
                if (!this.collection) {
                    // /api/0/maps/ API Endpoint gets built:
                    this.collection = new Maps();
                    this.collection.setServerQuery("WHERE project = " + this.app.getProjectID());
                    this.collection.fetch({
                        reset: true,
                        success: function (collection) {
                            // setting the current model from 'success' due to asynchronicity
                            that.setModel(collection);
                        }
                    });
                }
                this.modal = new Modal();
                
                this.listenTo(this.collection, 'reset', this.drawOnce);
                this.listenTo(this.app.vent, "create-new-map", this.newMap);
            },
            templateHelpers:  function () {
                return {
                    isShowing: this.isShowing
                }
            },

            setModel: function (collection) {
                this.app.currentMap = this.collection.at(0);
            },

            newMap: function (mapAttrs) {
                var that = this;
                var latLng = this.app.basemapView.getCenter();
                this.map = new Map({
                    name: mapAttrs.name, 
                    slug: mapAttrs.slug,
                    center: {
                        "type": "Point",
                        "coordinates": [
                            latLng.lng(),
                            latLng.lat()
                        ]
                    },
                    basemap: this.app.getMapTypeId(),
                    zoom: this.app.getZoom(),
                    project_id: this.app.getProjectID()
                });
              
                this.collection.add(this.map);
                
                this.map.save(null, {
                    success: this.render,
                    error: function (model, response){
                        var messages = JSON.parse(response.responseText);
                        console.log(messages);
                        if (messages.slug && messages.slug.length > 0) {
                            that.slugError = messages.slug[0];
                            console.log("should have error message", that.slugError);
                        }
                        that.app.vent.trigger("send-modal-error", that.slugError);
                    }
                    
                });
            },

            drawOnce: function () {
                this.render();
                var $selected = this.$el.find("#map-select").val();
                var selectedMapModel = this.collection.get($selected);

                this.setCenterZoom(selectedMapModel);
                this.setMapTypeId(selectedMapModel);
                this.app.vent.trigger("change-map", selectedMapModel);
            },

            changeMap: function(e) {
                var id = $(e.target).val();
                var selectedMapModel = this.collection.get(id);

                this.setCenterZoom(selectedMapModel);
                this.setMapTypeId(selectedMapModel);
                this.app.vent.trigger("change-map", selectedMapModel);
                this.app.vent.trigger("hide-right-panel");
            },

            showAddMapModal: function() {
                var createMapModel = new NewMap({
                    app: this.app
                });
                this.modal.update({
                    class: "add-map",
                    view: createMapModel,
                    title: 'Add Map',
                    width: 400,
                    height: 0,
                    closeButtonText: "Done",
                    showSaveButton: true,
                    saveFunction: createMapModel.saveMap.bind(createMapModel),
                    showDeleteButton: false
                });
                this.modal.show();
                this.showSection();
            },

            setCenterZoom: function (selectedMapModel) {
                var location = selectedMapModel.getDefaultLocation();
                this.app.basemapView.setCenter(location.center);
                this.app.basemapView.setZoom(location.zoom);
            },

            setMapTypeId: function (selectedMapModel) {
                var skin = selectedMapModel.getDefaultSkin();
                this.app.basemapView.setMapTypeId(skin.basemap);
            },

            hideSection: function (e) {
                console.log("show section");
                this.isShowing = false;
                this.saveState();
                this.render();
            },
            showSection: function (e) {
                console.log("show section");
                this.isShowing = true;
                this.saveState();
                this.render();
            },
            saveState: function () {
                this.app.saveState("select-map", {
                    isShowing: this.isShowing
                });
            },
            restoreState: function () {
                var state = this.app.restoreState("select-map");
                if (state) {
                    this.isShowing = state.isShowing;
                }
            }

        });
        return SelectMapView;
    });
