define(["marionette",
        "underscore",
        "handlebars",
        "models/map",
        "apps/project_detail/views/map-item",
        "lib/shared-views/new-map-modal-view",
        "text!../templates/map-list-manager.html"
    ],
    function (Marionette, _, Handlebars, Map, MapItemView, CreateMapModel, MapListManagerTemplate) {
        'use strict';

        // in this view, each childview is a layer
        var LayerListManager = Marionette.CompositeView.extend({
            tagName: 'div',
            template: Handlebars.compile(MapListManagerTemplate),

            initialize: function (opts) {
                _.extend(this, opts);
                this.sortProperty = 'name';
            },
            templateHelpers: function() {
                return {
                    sortProperty: this.sortProperty
                }
            },
            events: {
                'click #add-map': 'showAddMapModal',
                'change .sort_by': 'sortMaps'
            },
            childViewOptions: function (model, index) {
                // const dm = this.app.dataManager;
                return {
                    app: this.app//,
                    // collection: model.getSymbols(),
                    // dataCollection: dm.getCollection(model.get('dataset').overlay_type)
                };
            },
            childView: MapItemView,
            childViewContainer: '.map-list_wrapper',

            showAddMapModal: function (e) {                
                var createMapModel = new CreateMapModel({
                    app: this.app,
                    model: new Map({
                        center: {
                            "type": "Point",
                            "coordinates": [ 151, -34 ]
                        },
                        basemap: 7,
                        zoom: 15,
                        project_id: this.model.get('id'),
                        metadata: {}
                    })
                });
    
                this.app.modal.update({
                    class: "add-map",
                    view: createMapModel,
                    title: 'New Map',
                    width: 400,
                    saveButtonText: "Create Map",
                    closeButtonText: "Cancel",
                    showSaveButton: true,
                    saveFunction: createMapModel.saveMap.bind(createMapModel),
                    showDeleteButton: false
                });
    
                this.app.modal.show();
                if (e) { e.preventDefault(); }
            },

            sortMaps: function(e) {
                this.sortProperty = e.target.value;
                this.collection.setComparator(e.target.value);
                this.collection.sort();
                this.render();
            }

           
        });
        return LayerListManager;

    });
