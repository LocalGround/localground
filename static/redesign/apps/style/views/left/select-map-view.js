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
                'click .add-map': 'showAddMapModal'
            },
            modal: null,

            initialize: function (opts) {
                var that = this;
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
                    success: function() {
                        that.drawOnce(),
                        that.modal.hide()
                    },
                    error: function (model, response){
                        that.app.vent.trigger("send-modal-error", response); 
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
                var createMapModal = new NewMap({
                    app: this.app
                });
                this.modal.update({
                    class: "add-map",
                    view: createMapModal,
                    title: 'Add Map',
                    width: 400,
                    height: 0,
                    closeButtonText: "Done",
                    showSaveButton: true,
                    saveFunction: createMapModal.saveMap.bind(createMapModal),
                    showDeleteButton: false
                });
                this.modal.show();
            },

            setCenterZoom: function (selectedMapModel) {
                if(!selectedMapModel) {return;}
                var location = selectedMapModel.getDefaultLocation();
                this.app.basemapView.setCenter(location.center);
                this.app.basemapView.setZoom(location.zoom);
            },

            setMapTypeId: function (selectedMapModel) {
                if(!selectedMapModel) {return;}
                var skin = selectedMapModel.getDefaultSkin();
                this.app.basemapView.setMapTypeId(skin.basemap);
            }

        });
        return SelectMapView;
    });
