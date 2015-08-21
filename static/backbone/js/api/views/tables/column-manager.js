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
            this.model = new Field({ ordering: this.ordering }, {
                urlRoot: this.url.replace('data/', 'fields/')
            });
            // once the new field has been added to the database,
            //	add it to the table:
            //this.model.on('sync', this.addColumnToGrid, this);
            /*this.globalEvents.on("insertRowTop", function (e) {
                that.insertRowTop(e);
            });*/
        },
        ensureRequiredParam: function (param) {
            if (!this[param]) {
                throw "\"" + param + "\" initialization parameter is required";
            }
        },
        addColumnToGrid: function () {
            var opts = {
                    name: this.model.get("col_name"),
                    label: this.model.get("col_alias"),
                    editable: true
                },
                cols = Columns.generateColumnsFromField(this.model.get("col_name"), opts);
            //console.log(cols);
            //this.globalEvents.trigger('insertColumnsToGrid', cols);
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
                that.addColumnForm.commit();                //does validation
                that.model.save(null, {success: function () {     //does database commit
                    that.globalEvents.trigger("add-to-columns", that.model);
                }});
            });
        }
    });
    return ColumnManager;
});
