define(["jquery",
        "marionette",
        "handlebars",
        "models/map",
        "collections/maps",
        "models/layer",
        "collections/layers",
        "apps/main/views/left/new-map-modal-view",
        "text!../../templates/left/select-map.html",
    ],
    function ($, Marionette, Handlebars, Map, Maps, Layer, Layers, CreateMapForm, MapTemplate) {
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

                //this.modal = new Modal();
                this.modal = this.app.modal;
                //this.listenTo(this.collection, 'reset', this.setInitialModel);
                this.listenTo(this.app.vent, "create-new-map", this.newMap);
                this.listenTo(this.app.vent, "edit-map", this.updateMap);
                this.listenTo(this.app.vent, 'init-default-map', this.setInitialModel);
                this.listenTo(this.app.vent, 'update-map-list', this.setInitialModel);
                this.listenTo(this.app.vent, 'route-map', this.getSelectedMap);
                this.listenTo(this.app.vent, 'open-new-map-modal', this.showAddMapModal);
            },

            getSelectedMap: function(mapId) {
                console.log('route to map');
                this.setActiveMap(this.collection.get(mapId));
            },

            setInitialModel: function () {
                // on initialize, pass the first model in the collection
                // to be set as the active map
                this.setActiveMap(this.collection.at(0));
                this.render();
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
            setActiveMap: function (map) {
                if (this.collection.length == 0) {
                    return;
                }
                var selectedMapModel = map,
                    that = this;
                this.activeMap = map;
            },

            showAddMapModal: function () {
                var latLng = this.app.basemapView.getCenter();
                var createMapModel = new CreateMapForm({
                    app: this.app,
                    model: new Map({
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
                    })
                });

                this.modal.update({
                    class: "add-map",
                    view: createMapModel,
                    title: 'New Map',
                    width: 600,
                    //height: 400,
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
