define([
    "backbone",
    "marionette",
    "models/field",
    "collections/dataTypes",
    "form",
    "views/tables/table-utilities-mixin",
    "bootstrap-form-templates",
    "backbone-bootstrap-modal"
], function (Backbone, Marionette, Field, DataTypes, EditForm, Utilities) {
	"use strict";
    var ColumnManager = Marionette.ItemView.extend({
        dataTypes: new DataTypes(),
        modal: null,
        modelEvents: {
            'schema-ready': 'render'
        },
        initialize: function (opts) {
            _.extend(this, opts);
            this.ensureRequiredParam("url");
            this.ensureRequiredParam("columns");
            this.ensureRequiredParam("globalEvents");
            this.dataTypes.fetch({reset: true});
        },
        render: function () {
            this.model = new Field(null, {
                urlRoot: this.url.replace('data/', 'fields/')
            });
            this.listenTo(this.model, 'model-columnized', this.addColumn);
            var that = this,
                ordering = this.columns.at(this.columns.length - 1).get("ordering") + 1,
                FormClass,
                addColumnForm;
            this.model.set("ordering", ordering);
            FormClass = EditForm.extend({ schema: this.model.getFormSchema(this.dataTypes) });
            addColumnForm = new FormClass({ model: this.model }).render();
            this.modal = new Backbone.BootstrapModal({
                content: addColumnForm
            }).open();
            this.modal.on('ok', function () {
                that.commitChanges(addColumnForm);
            });
        },
        commitChanges: function (addColumnForm) {
            addColumnForm.commit();
            this.model.save();
        },
        addColumn: function () {
            this.columns.add(this.model);
            this.columns.trigger('column-added');
        }
    });
    _.extend(ColumnManager.prototype, Utilities);
    return ColumnManager;
});
