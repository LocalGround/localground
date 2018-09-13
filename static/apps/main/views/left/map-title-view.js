define(["marionette",
        "handlebars",
        "lib/editor-views/edit-map-form",
        "models/layer",
        "apps/main/views/left/create-layer-form",
        "text!../../templates/left/map-title.html",
    ],
    function (Marionette, Handlebars, EditMapForm, Layer, CreateLayerForm, MapTemplate) {
        'use strict';

        var MapTitleView = Marionette.ItemView.extend({
            template: Handlebars.compile(MapTemplate),
            initialize: function (opts) {
                var that = this;
                _.extend(this, opts);
                this.modal = this.app.modal;
            },
            events: {
                'click .add-layer': 'createNewLayer',
                'click .map-title': 'showEditModal'
            },
            createNewLayer: function(e) {
                var createLayerForm = new CreateLayerForm({
                    app: this.app,
                    map: this.model,
                    model: new Layer({
                        map_id: this.model.id
                    })
                });

                this.modal.update({
                    app: this.app,
                    class: "add-layer",
                    view: createLayerForm,
                    title: 'Add Layer',
                    width: 300,
                    saveButtonText: "Add Layer",
                    closeButtonText: "Cancel",
                    showSaveButton: true,
                    saveFunction: createLayerForm.saveLayer.bind(createLayerForm),
                    showDeleteButton: false
                });
                this.modal.show();
                if(e) { e.preventDefault(); }
            },
            modelEvents: {
                'change:name': 'render'
            },
            showEditModal: function (e) {
                const editMapForm = new EditMapForm({
                    app: this.app,
                    model: this.model
                })
                this.modal.update({
                    view: editMapForm,
                    title: 'Edit Map Name and Description',
                    width: 400,
                    saveButtonText: "Save",
                    closeButtonText: "Cancel",
                    showSaveButton: true,
                    saveFunction: editMapForm.saveMap.bind(editMapForm),
                    showDeleteButton: false
                });
                this.modal.show();
                if (e) { e.preventDefault(); }
            }
        });
        return MapTitleView;
    });
