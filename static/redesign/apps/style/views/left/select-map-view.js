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
                    noItems: (this.collection.length === 0),
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
                    // /api/0/maps/ API Endpoint gets built:
                    this.collection = new Maps();
                    this.collection.setServerQuery("WHERE project = " + this.app.getProjectID());
                    this.collection.fetch({
                        reset: true,
                        success: function (collection) {
                            // setting the current model from 'success' due to asynchronicity
                            that.setModel();
                            that.app.vent.trigger("init-collection");
                        }
                    });
                } else {
                    this.setModel();
                    this.drawOnce();
                }
                this.modal = new Modal();

                this.listenTo(this.collection, 'reset', this.drawOnce);
                this.listenTo(this.app.vent, "create-new-map", this.newMap);
                this.listenTo(this.app.vent, 'update-map-list', this.updateMapList);
            },

            setModel: function () {
                if (this.collection.length > 0 ) {
                    this.app.selectedMapModel = this.collection.at(0);
                    //this.app.selectedMapModel = this.model;
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
              
                
                this.map.save(null, {
                    success: this.setMapAndRender.bind(this),
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

            setMapAndRender: function () {
                this.collection.add(this.map);
                this.modal.hide();
                if (!this.app.selectedMapModel) {
                    this.setModel();
                }
                this.app.selectedMapModel = this.map;
                this.showSection();
                this.render();
                this.$el.find('#map-select').val(this.map.id);
                
                this.setCenterZoom(this.map);
                this.setMapTypeId(this.map);
                this.app.vent.trigger("change-map", this.map);
                this.app.vent.trigger("hide-right-panel");

            },

            drawOnce: function () {
                this.render();
                if (this.collection.length == 0) {
                    return;
                }
                var $selected = this.$el.find("#map-select").val(),
                    selectedMapModel = this.collection.get($selected);

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

            updateMapList: function () {
                var id = this.$el.find('#map-select').val(),
                selectedMapModel = this.collection.get(id);

                this.setCenterZoom(selectedMapModel);
                this.setMapTypeId(selectedMapModel);
                this.app.vent.trigger("change-map", selectedMapModel);
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