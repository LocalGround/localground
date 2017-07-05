define(["jquery",
        "marionette",
        "handlebars",
        "models/map",
        "collections/maps",
        "models/layer",
        "collections/layers",
        "apps/style/views/left/new-map-modal-view",
        "text!../../templates/left/select-map.html",
        "lib/modals/modal"
    ],
    function ($, Marionette, Handlebars, Map, Maps, Layer, Layers, NewMap, MapTemplate, Modal) {
        'use strict';

        var SelectMapView = Marionette.ItemView.extend(_.extend({}, {
            stateKey: 'select-map',
            isShowing: true,
            template: Handlebars.compile(MapTemplate),
            templateHelpers: function() {
                return {
                    noItems: (this.collection.length === 0)
                }
            },

            events: function () {
                return _.extend(
                    {
                        'change #map-select': 'setActiveMap',
                        'click .add-map': 'showAddMapModal'
                    }
                );
            },
            modal: null,

            initialize: function (opts) {
                var that = this;
                _.extend(this, opts);
                if (!this.collection) {
                    // /api/0/maps/ API Endpoint gets built:
                    this.collection = new Maps();
                    this.collection.setServerQuery("WHERE project = " + this.app.getProjectID());
                    this.collection.fetch({ reset: true });
                } else {
                    this.drawOnce();
                }
                this.modal = new Modal();

                this.listenTo(this.collection, 'reset', this.drawOnce);
                this.listenTo(this.app.vent, "create-new-map", this.newMap);
                this.listenTo(this.app.vent, 'update-map-list', this.setActiveMap);
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
                var that = this;
                this.collection.add(this.map);
                var dataSources = this.app.dataManager.getDataSources();
                this.modal.hide();               
                this.showSection();
                this.render();
                this.$el.find('#map-select').val(this.map.id);
                
                var layers = new Layers(null, {mapID: this.map.get("id")});
                this.map.set("layers", layers);

                dataSources.forEach(function(dataSource) {
                    var collection = that.app.dataManager.getCollection(dataSource.value);
                        if (dataSource.value === "markers") {
                            var layer = new Layer({
                                map_id: that.map.id,
                                data_source: dataSource.value, 
                                layer_type: "basic",
                                filters: {},
                                symbols: [{
                                    "fillColor": collection.fillColor,
                                    "width": 20,
                                    "rule": "*",
                                    "title": dataSource.name
                                }],
                                metadata: {
                                    buckets: 4,
                                    paletteId: 0,
                                    fillOpacity: 1,
                                    width: 20,
                                    fillColor: collection.fillColor,
                                    strokeColor: "#ffffff",
                                    strokeWeight: 1,
                                    strokeOpacity: 1,
                                    shape: "circle"
                                },
                                title: "Sites"
                            });
                            layers.add(layer);
                            layer.save();
                        } else if (dataSource.value.includes("form_")){
                            var layer = new Layer({
                                map_id: that.map.id,
                                data_source: dataSource.value, 
                                layer_type: "basic",
                                filters: {},
                                symbols: [{
                                    "fillColor": collection.fillColor,
                                    "width": 20,
                                    "rule": "*",
                                    "title": dataSource.name
                                }],
                                metadata: {
                                    buckets: 4,
                                    paletteId: 0,
                                    fillOpacity: 1,
                                    width: 20,
                                    fillColor: collection.fillColor,
                                    strokeColor: "#ffffff",
                                    strokeWeight: 1,
                                    strokeOpacity: 1,
                                    shape: "circle"
                                },
                                title: dataSource.name
                            });
                            layers.add(layer);
                            layer.save();
                        }});
                this.app.vent.trigger("change-map", this.map);
            },

            drawOnce: function () {
                this.render();
                this.setActiveMap();
            },

            setActiveMap: function () {
                if (this.collection.length == 0) {
                    return;
                }
                var id = this.$el.find('#map-select').val(),
                    that = this,
                    selectedMapModel = this.collection.get(id);
                //re-fetch map from server so that it also returns the layers:
                selectedMapModel.fetch({ success: function () {
                    that.setCenterZoom(selectedMapModel);
                    that.setMapTypeId(selectedMapModel);
                    that.app.vent.trigger("change-map", selectedMapModel);
                    that.app.vent.trigger("hide-right-panel");
                }});
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