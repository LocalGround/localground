define(["marionette",
        "handlebars",
        "apps/main/views/left/edit-map-form",
        "text!../../templates/left/map-title.html",
    ],
    function (Marionette, Handlebars, EditMapForm, MapTemplate) {
        'use strict';

        var MapTitleView = Marionette.ItemView.extend({
            template: Handlebars.compile(MapTemplate),
            initialize: function (opts) {
                var that = this;
                _.extend(this, opts);
                this.modal = this.app.modal;
            },
            events: {
                'click': 'showEditModal'
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
                    title: 'Edit Map',
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
