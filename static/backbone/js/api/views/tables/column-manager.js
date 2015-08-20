define([
    "backbone",
    "marionette",
    "models/field",
    "form",
    "views/tables/columns",
    "bootstrap-form-templates",
    "backbone-bootstrap-modal"
], function (Backbone, Marionette, Field, EditForm, Columns) {
	"use strict";
    var ColumnManager = Marionette.ItemView.extend({
        model: null,
        modal: null,
        FormClass: null,
        addColumnForm: null,
        schema: {},
        modelEvents: {
            'schema-ready': 'render'
        },
        initialize: function (opts) {
            var that = this;
            _.extend(this, opts);
            this.model = new Field(null, {
                urlRoot: this.url.replace('data/', 'fields/'),
                ordering: this.ordering
            });
            // once the new field has been added to the database,
            //	add it to the table:
            this.model.on('sync', function () {
                that.grid.insertColumn({
                    name: this.model.get("col_name"),
                    label: this.model.get("col_alias"),
                    cell: Columns.cellTypeByIdLookup[this.model.get("data_type").toString()],
                    editable: true
                });
            });
        },
        render: function () {
            var key, val, that = this;
            for (key in this.model.schema) {
                val = this.model.schema[key];
                this.schema[key] = {
                    type: 'Text',
                    title: val.label || key,
                    help: val.help_text || key
                };
            }
            this.FormClass = EditForm.extend({
                schema: this.schema
            });
            this.addColumnForm = new this.FormClass({
                model: this.model
            }).render();
            console.log(this.addColumnForm);

            this.modal = new Backbone.BootstrapModal({
                content: this.addColumnForm
            }).open();
            this.modal.on('ok', function () {
                that.addColumnForm.commit();    //does validation
                that.model.save();              //does database commit
            });
        }
    });
    return ColumnManager;
});
