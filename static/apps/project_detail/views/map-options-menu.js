define(["underscore",
        "marionette",
        "handlebars",
        "text!../templates/map-options-menu.html",
        "lib/shared-views/edit-map-form",
        "lib/shared-views/share-settings",
        "views/generate-print"
    ],
    function (_, Marionette, Handlebars, MapOptionsMenuTemplate, EditMapForm, ShareSettings,
            PrintLayoutView) {
        'use strict';

        var MapOptionsMenu =  Marionette.ItemView.extend({
            events: {
                'click .open-map': 'openMap',
                'click .copy-map': 'copyMap',
                'click .rename-map': 'renameMap',
                'click .delete-map': 'deleteMap',
                'click .share-map': 'showShareMenu',
                'click .print-map': 'showPrintModal'
            },

            initialize: function (opts) {
                _.extend(this, opts);
                this.modal = this.app.modal;
                console.log(this.model);
            },

            // editLayerName: function() {
            //     const editLayerNameModal = new EditLayerName({
            //         app: this.app,
            //         model: this.model
            //     });
            //     this.modal.update({
            //         app: this.app,
            //         class: "edit-layer-name",
            //         view: editLayerNameModal,
            //         title: 'Edit Layer Name',
            //         width: 400,
            //         saveButtonText: "Save",
            //         closeButtonText: "Cancel",
            //         showSaveButton: true,
            //         saveFunction: editLayerNameModal.saveLayer.bind(editLayerNameModal),
            //         showDeleteButton: false
            //     });
            //     this.modal.show();
            // },

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
            },

            deleteMap: function() {
                if (this.app.dataManager.getMaps().length < 2) {
                    alert("You are trying to delete your only map. You must have at least one map at all times. Please create a new map before deleting the current one.")
                    return;
                }
                if (!confirm("Are you sure you want to delete this map?")) {
                    return;
                }
                this.app.popover.hide();
                this.app.dataManager.destroyMap(this.model);
            },

            showShareMenu: function() {
                let shareSettings = new ShareSettings({
                    app: this.app,
                    activeMap: this.model
                });
                this.modal.update({
                    bodyClass: 'gray',
                    app: this.app,
                    view: shareSettings,
                    title: 'Sharing Settings',
                    saveButtonText: 'Save',
                    saveFunction: shareSettings.saveShareSettings.bind(shareSettings),
                    closeButtonText: "Cancel",
                    width: 600,
                    height: null,
                    showSaveButton: true,
                    showDeleteButton: false
                });
                this.modal.show();
                this.app.popover.hide();
            },

            //TODO: come back to this. Where does the print button go?
            showPrintModal: function (opts) {
                var printLayout = new PrintLayoutView({
                    app: this.app
                });
                this.modal.update({
                    bodyClass: 'gray',
                    app: this.app,
                    view: printLayout,
                    title: 'Generate Print',
                    saveButtonText: 'Print',
                    width: 1000,
                    height: null,
                    closeButtonText: "Done",
                    showSaveButton: true,
                    showDeleteButton: false,
                    saveFunction: printLayout.callMakePrint.bind(printLayout)
                });
                this.modal.show();
            }
            
        });
        return MapOptionsMenu;
    });
