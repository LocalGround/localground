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
                if (this.activeMap) {
                    var name = this.activeMap.get('name');
                }
                return {
                    noItems: (this.collection.length === 0),
                    map: this.activeMap,
                    name: name
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
                if (!this.collection) {
                    // /api/0/maps/ API Endpoint gets built:
                    this.collection = new Maps(null, { projectID: this.app.getProjectID() });
                    this.collection.setServerQuery("");
                    this.collection.fetch({ reset: true });
                } else {
                    this.drawOnce();
                }

                $('body').click(this.hideFonts);

                this.modal = new Modal();
                this.listenTo(this.collection, 'reset', this.setInitialModel);
                this.listenTo(this.app.vent, "create-new-map", this.newMap);
                this.listenTo(this.app.vent, "edit-map", this.updateMap);
                this.listenTo(this.app.vent, 'update-map-list', this.setInitialModel);
            },

            setInitialModel: function () {
                this.render();

                // on initialize, pass the first model in the collection
                // to be set as the active map
                this.setActiveMap(this.collection.at(0));
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

            updateMap: function (map) {
                var that = this;
                this.map = map;
                this.map.save(null, {
                    success: function () {
                        that.modal.hide();
                        that.render();
                    }
                });
              /*  this.map.save(null, {
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
                });  */
            },

            setMapAndRender: function () {
                var that = this,
                    dm = this.app.dataManager;
                this.collection.add(this.map);
                this.modal.hide();
                this.render();
                this.$el.find('#map-select').val(this.map.id);

                var layers = new Layers(null, {mapID: this.map.get("id")});
                this.map.set("layers", layers);
                dm.each(function (entry) {
                    var collection = entry.getCollection(); //that.app.dataManager.getCollection(dataSource.value);
                    if (collection.length < 1) {
                        return;
                    }
                    if (entry.getIsSite()) {
                        var layer = new Layer({
                            map_id: that.map.id,
                            data_source: entry.getDataType(),
                            layer_type: "basic",
                            filters: {},
                            symbols: [{
                                "fillColor": collection.fillColor,
                                "width": 20,
                                "rule": "*",
                                "title": entry.getTitle()
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
                            title: entry.getTitle()
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

            // function is needed to handle the different two different events that eminate
            // from clicking within the '.map-item' div. this is necessary because a click on just the
            // '.edit-map' button also triggers a click on its parent, the '.map-item' div
            handleItemClicks: function () {
                console.log($(event.target).attr('class'));
                var id = $(event.target).data('value'),
                map = this.collection.get(id);

                if ($(event.target).hasClass('map-edit')) {
                    this.editMap(map);
                } else if ($(event.target).hasClass('map-item') || $(event.target).hasClass('map-name')){
                    this.setActiveMap(map);
                }
            },

            showAddMapModal: function () {
                var createMapModel = new NewMap({
                    app: this.app,
                    mode: 'createNewMap'
                });
                this.modal.update({
                    class: "add-map",
                    view: createMapModel,
                    title: 'Add Map',
                    width: 400,
                    height: 130,
                    closeButtonText: "Done",
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
            },

            showMapList: function() {
                this.$el.find('.map-list').show();
            },

            hideMapList: function(e) {
                var $el = $(e.target);
                if (!$el.hasClass('selected-map-item') && !$el.hasClass('map-name') && !$el.hasClass('map-edit')) {
                    this.$el.find('.map-list').hide();
                }
            },

            editMap: function (map) {
                this.showEditMapModal(map);
            }

        }));
        return SelectMapView;
    });
