define(["underscore",
        "marionette",
        "handlebars",
        "text!../../templates/left/edit-layer-menu.html",
        "apps/main/views/left/edit-layer-name-modal-view",
        "apps/main/views/left/edit-display-field-modal-view",
    ],
    function (_, Marionette, Handlebars, EditLayerMenuTemplate,
            EditLayerName, EditDisplayField) {
        'use strict';

        var EditLayerMenu =  Marionette.ItemView.extend({
            events: {
                'click .rename-layer': 'editLayerName',
                'click .delete-layer' : 'deleteLayer',
                'click .edit-display-field': 'editDisplayField',
                'click .zoom-to-extents': 'zoomToExtents'
            },

            initialize: function (opts) {
                _.extend(this, opts);
                this.modal = this.app.modal;
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

            template: Handlebars.compile(EditLayerMenuTemplate),

            deleteLayer: function () {
                if (!confirm("Are you sure you want to delete this layer?")) {
                    return;
                }
                this.model.destroy();
            },

            updateTitle: function (title) {
                this.model.set("title", title);
                this.render();
            },

            editDisplayField: function() {
                const editDisplayFieldModal = new EditDisplayField({
                    app: this.app,
                    model: this.model
                });
                this.modal.update({
                    app: this.app,
                    class: "edit-display-field",
                    view: editDisplayFieldModal,
                    title: 'Display Field',
                    width: 400,
                    //height: 200,
                    saveButtonText: "Save",
                    closeButtonText: "Cancel",
                    showSaveButton: true,
                    saveFunction: editDisplayFieldModal.saveLayer.bind(editDisplayFieldModal),
                    showDeleteButton: false
                });
                this.modal.show();
            },

            getMarkerOverlays: function () {
                const markerOverlays = this.children.map(view => view.getMarkerOverlays());
                if (markerOverlays.length > 0) {
                    return markerOverlays.reduce((a, b) => a.concat(b));
                }
                return [];
            },
            getBounds: function () {
                var bounds = new google.maps.LatLngBounds();
                this.getMarkerOverlays().forEach(overlay => {
                    bounds.union(overlay.getBounds());
                })
                return bounds;
            },
            zoomToExtents: function (e) {
                var bounds = this.getBounds();
                if (!bounds.isEmpty()) {
                    this.app.map.fitBounds(bounds);
                }
                if (e) { e.preventDefault(); }
            }
        });
        return EditLayerMenu;
    });
