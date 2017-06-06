define(["jquery",
        "marionette",
        "handlebars",
        "models/map",
        "collections/maps",
        "apps/style/views/left/new-map-modal-view",
        "apps/style/visibility-mixin",
        "text!../../templates/left/select-map.html",
        "lib/modals/modal"
    ],
    function ($, Marionette, Handlebars, Map, Maps, NewMap, PanelVisibilityExtensions, MapTemplate, Modal) {
        'use strict';

        var SelectMapView = Marionette.ItemView.extend(_.extend({}, PanelVisibilityExtensions, {
            stateKey: 'select-map',
            isShowing: true,
            template: Handlebars.compile(MapTemplate),
            templateHelpers: function() {
                return {
                    noItem: (this.collection.length === 0),
                    isShowing: this.isShowing
                }
            },

            events: function () {
                return _.extend(
                    {
                        'change #map-select': 'changeMap',
                        'click .add-map': 'showAddMapModal'
                    },
                    PanelVisibilityExtensions.events
                );
            },
            modal: null,

            initialize: function (opts) {
                var that = this;
                _.extend(this, opts);
                this.restoreState();
                if (!this.collection) {
                    console.log(this.collection);
                    // /api/0/maps/ API Endpoint gets built:
                    this.collection = new Maps();
                    this.collection.setServerQuery("WHERE project = " + this.app.getProjectID());
                    this.collection.fetch({
                        reset: true,
                        success: function (collection) {
                            // setting the current model from 'success' due to asynchronicity
                            that.setModel();
                            console.log("success: ", that.collection);
                        }
                    });
                    console.log("drawOnce triggered from 'if' (collection does not exist)");
                } else {
                    console.log("drawOnce triggered from 'else' (collection exists)");
                    this.setModel();
                    this.drawOnce();
                }
                this.modal = new Modal();

                this.listenTo(this.collection, 'reset', this.drawOnce);
                this.listenTo(this.app.vent, "create-new-map", this.newMap);
            },

            setModel: function () {
                console.log("setModel");

                if (this.collection >0 ) {
                    this.app.currentMap = this.collection.at(0);
                }

            },

            newMap: function (mapAttrs) {
                var that = this,
                    latLng = this.app.basemapView.getCenter();
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
                console.log("draw once called");
                console.log(this.collection);
                this.render();
                var $selected = this.$el.find("#map-select").val(),
                    selectedMapModel = this.collection.get($selected);

                console.log($selected, selectedMapModel);
                this.setCenterZoom(selectedMapModel);
                this.setMapTypeId(selectedMapModel);
                this.app.vent.trigger("change-map", selectedMapModel);
            },

            changeMap: function (e) {
                var id = $(e.target).val(),
                    selectedMapModel = this.collection.get(id);

                this.setCenterZoom(selectedMapModel);
                this.setMapTypeId(selectedMapModel);
                this.app.vent.trigger("change-map", selectedMapModel);
                this.app.vent.trigger("hide-right-panel");
            },

            showAddMapModal: function () {
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
            }

        }));
        return SelectMapView;
    });