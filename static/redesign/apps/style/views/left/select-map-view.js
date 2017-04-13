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

            template: Handlebars.compile(MapTemplate),

            events: {
                'change #map-select': 'changeMap',
                'click .add-map': 'addMap'
            },
            modal: null,

            initialize: function (opts) {
                var that = this;
                //this.app = opts.app;
                //this.collection = opts.collection;
                _.extend(this, opts);
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

            setModel: function (collection) {
                this.app.currentMap = this.collection.at(0);
            },

            newMap: function (mapName) {
                latLng = this.basemapView.getCenter();
                this.map = new Map({
                    name: mapName, 
                    slug: "test",
                    center: {
                        "type": "Point",
                        "coordinates": [
                            latLng.lng(),
                            latLng.lat()
                        ]
                    },
                    basemap: 12,
                    project_id: 3
                });
                this.collection.add(this.map);
                this.render();
                this.map.save();
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
            },

            addMap: function() {
                // u can var createMapModeol= new Marionette.ItemView({}); or create new file
                console.log(this.app);
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
                    // bind the scope of the save function to the source view:
                    //saveFunction: createForm.saveFormSettings.bind(createForm)
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

        });
        return SelectMapView;
    });
