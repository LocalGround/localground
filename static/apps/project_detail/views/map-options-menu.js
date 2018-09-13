define(["underscore",
        "marionette",
        "handlebars",
        "text!../templates/map-options-menu.html",
        "lib/editor-views/edit-map-form",
        "apps/main/views/left/edit-layer-name-modal-view",
        "apps/main/views/left/edit-display-field-modal-view",
    ],
    function (_, Marionette, Handlebars, MapOptionsMenuTemplate, EditMapForm,
            EditLayerName, EditDisplayField) {
        'use strict';

        var MapOptionsMenu =  Marionette.ItemView.extend({
            events: {
                'click .open-map': 'openMap',
                'click .copy-map': 'copyMap',
                'click .rename-map': 'renameMap',
                'click .delete-map': 'deleteMap',
                'click .share-map': 'shareMap',
                'click .print-map': 'printMap'
            },

            initialize: function (opts) {
                _.extend(this, opts);
                this.modal = this.app.modal;
                console.log(this.model);
            },

            editLayerName: function() {
                const editLayerNameModal = new EditLayerName({
                    app: this.app,
                    model: this.model
                });
                this.modal.update({
                    app: this.app,
                    class: "edit-layer-name",
                    view: editLayerNameModal,
                    title: 'Edit Layer Name',
                    width: 400,
                    saveButtonText: "Save",
                    closeButtonText: "Cancel",
                    showSaveButton: true,
                    saveFunction: editLayerNameModal.saveLayer.bind(editLayerNameModal),
                    showDeleteButton: false
                });
                this.modal.show();
            },

            template: Handlebars.compile(MapOptionsMenuTemplate),

            templateHelpers: function() {
                return {
                    mapUrl: `/projects/${this.model.get('project_id')}/maps/#/${this.model.get('id')}`
                }
            },

            renameMap: function() {
                const editMapForm = new EditMapForm({
                    app: this.app,
                    model: this.model
                });
                this.modal.update({
                    app: this.app,
                    class: "edit-map-name",
                    view: editMapForm,
                    title: 'Edit Map',
                    width: 400,
                    saveButtonText: "Save",
                    closeButtonText: "Cancel",
                    showSaveButton: true,
                    saveFunction: editMapForm.saveMap.bind(editMapForm),
                    showDeleteButton: false
                });
                this.modal.show();
                this.app.popover.hide();
            }
            
        });
        return MapOptionsMenu;
    });
