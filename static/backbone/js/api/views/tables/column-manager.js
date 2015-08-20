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
        formSchema: null,
        modelEvents: {
            'schema-ready': 'render'
        },
        initialize: function (opts) {
            _.extend(this, opts);
            this.ensureRequiredParam("url");
            this.ensureRequiredParam("ordering");
            this.ensureRequiredParam("globalEvents");
            this.model = new Field(null, {
                urlRoot: this.url.replace('data/', 'fields/'),
                ordering: this.ordering
            });
            // once the new field has been added to the database,
            //	add it to the table:
            this.model.on('sync', this.addColumnToGrid, this);
        },
        ensureRequiredParam: function (param) {
            if (!this[param]) {
                throw "\"" + param + "\" initialization parameter is required";
            }
        },
        addColumnToGrid: function () {
            this.globalEvents.trigger('insertColumnConfirmed', {
                name: this.model.get("col_name"),
                label: this.model.get("col_alias"),
                cell: Columns.cellTypeByIdLookup[this.model.get("data_type").toString()],
                editable: true
            });
            //this.grid.insertColumn();
        },
        render: function () {
            var that = this;
            this.FormClass = EditForm.extend({
                schema: this.model.getFormSchema()
            });
            this.addColumnForm = new this.FormClass({
                model: this.model
            }).render();

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
