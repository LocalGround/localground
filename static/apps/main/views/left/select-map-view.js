define(["jquery",
        "marionette",
        "handlebars",
        "models/map",
        "collections/maps",
        "models/layer",
        "collections/layers",
        "apps/main/views/left/new-map-modal-view",
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
                if (this.activeMap) {
                    var name = this.activeMap.get('name'),
                    slug = this.activeMap.get('slug')
                }
                return {
                    noItems: (this.collection.length === 0),
                    map: this.activeMap,
                    name: name,
                    previewURL: slug
                }
            },

            events: function () {
                return _.extend(
                    {
                        'change #map-select': 'setActiveMap',
                        'click .add-map': 'showAddMapModal',
                        'click .selected-map': 'showMapList',
                        'click .map-item': 'handleItemClicks',
                        'click': 'hideMapList'//,
                        //'click .map-edit': 'editMap'
                    }
                );
            },
            modal: null,

            initialize: function (opts) {
                var that = this;
                _.extend(this, opts);

                $('body').click(this.hideMapList.bind(this));

                this.modal = new Modal();
                //this.listenTo(this.collection, 'reset', this.setInitialModel);
                this.listenTo(this.app.vent, "create-new-map", this.newMap);
                this.listenTo(this.app.vent, "edit-map", this.updateMap);
                this.listenTo(this.app.vent, 'init-default-map', this.setInitialModel);
                this.listenTo(this.app.vent, 'update-map-list', this.setInitialModel);
                this.listenTo(this.app.vent, 'route-map', this.getSelectedMap);
                this.listenTo(this.app.vent, 'open-new-map-modal', this.showAddMapModal);
            },

            getSelectedMap: function(mapId) {
                this.setActiveMap(this.collection.get(mapId));
            },

            setInitialModel: function () {
                // on initialize, pass the first model in the collection
                // to be set as the active map
                this.setActiveMap(this.collection.at(0));
                this.render();
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
                        if (messages.slug && messages.slug.length > 0) {
                            that.slugError = messages.slug[0];
                        }
                        that.app.vent.trigger("send-modal-error", that.slugError);
                    }
                });
            },

            updateMap: function (map) {
                var that = this;
                this.map = map;
                this.map.save(null, {
                    success: function () {
                        that.modal.hide();
                        that.render();
                    }
                });
            },

            setMapAndRender: function () {
                var that = this,
                    dm = this.app.dataManager;
                   // dm = this.app.dataManager.model.attributes.children;
                this.collection.add(this.map);
                this.modal.hide();
                this.render();

                // sets newly created map as the selected map
                this.$el.find('#map-select').val(this.map.id);

                var layers = new Layers(null, {mapID: this.map.get("id")});
                this.map.set("layers", layers);

                dm.each(function (collection) {
                   if (collection.length < 1) {
                        return;
                    }
                    if (collection.getIsSite()) {
                        var layer = new Layer({
                            map_id: that.map.id,
                            data_source: collection.getDataType(),
                            layer_type: "basic",
                            filters: {},
                            symbols: [{
                                "fillColor": collection.fillColor,
                                "width": 20,
                                "rule": "*",
                                "title": collection.getTitle()
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
                            title: collection.getTitle()
                        });
                        layers.add(layer);
                        layer.save(null, {
                            success: console.log('layers saved successfully'),
                            error: function (model, response){
                                var messages = JSON.parse(response.responseText);
                                console.log(messages);
                            }
                        });;
                    }});
                this.setActiveMap(this.map);
             //   this.render();
                this.app.router.navigate('//' + this.map.id);
            },

            drawOnce: function () {
                this.render();
                this.setActiveMap();
            },

            setActiveMap: function (map) {
                if (this.collection.length == 0) {
                    return;
                }
                var selectedMapModel = map,
                    that = this;
                this.activeMap = map;
                selectedMapModel.fetch({ success: function () {
                    that.setCenterZoom(selectedMapModel);
                    that.setMapTypeId(selectedMapModel);
                    that.app.vent.trigger("change-map", selectedMapModel);
                    that.app.vent.trigger("hide-right-panel");
                    that.render();
                }});
            },

            selectMap: function () {
                var id = $(event.target).data('value'),
                map = this.collection.get(id);
                this.setActiveMap(map);
            },

            showAddMapModal: function () {
                var createMapModel = new NewMap({
                    app: this.app,
                    mode: 'createNewMap'
                });

                this.modal.update({
                    class: "add-map",
                    view: createMapModel,
                    title: 'New Map',
                    width: 600,
                    height: 400,
                    saveButtonText: "Create Map",
                    closeButtonText: "Cancel",
                    showSaveButton: true,
                    saveFunction: createMapModel.saveMap.bind(createMapModel),
                    showDeleteButton: false
                });
                this.modal.show();
            },

            showEditMapModal: function (map) {
                var createMapModel = new NewMap({
                    app: this.app,
                    mode: 'editExistingMap',
                    map: map
                });

                this.modal.update({
                    class: "add-map",
                    view: createMapModel,
                    title: 'Edit Map',
                    width: 400,
                    height: 150,
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
            },

            showMapList: function() {
                this.$el.find('.map-list').show();
            },

            hideMapList: function(e) {
                var $el = $(e.target);
                if (!$el.hasClass('selected-map-item') && !$el.hasClass('map-name') && !$el.hasClass('map-edit') && !$el.hasClass('map-select-option') && !$el.hasClass('map-dropdown')) {
                    this.$el.find('.map-list').hide();
                }
            },

            editMap: function () {
                var id = $(event.target).data('value'),
                map = this.collection.get(id);
                this.showEditMapModal(map);
            }

        }));
        return SelectMapView;
    });
