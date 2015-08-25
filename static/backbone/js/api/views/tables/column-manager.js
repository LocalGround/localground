define([
    "backbone",
    "marionette",
    "models/field",
    "collections/dataTypes",
    "form",
    "bootstrap-form-templates",
    "backbone-bootstrap-modal"
], function (Backbone, Marionette, Field, DataTypes, EditForm) {
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
            /*if (!this.model) {
                this.model = new Field(null, {
                    urlRoot: this.url.replace('data/', 'fields/')
                });
                this.model.set("ordering", (this.columns.length + 1));
            }*/
            this.dataTypes.fetch({reset: true});
        },
        ensureRequiredParam: function (param) {
            if (!this[param]) {
                throw "\"" + param + "\" initialization parameter is required";
            }
        },
        render: function () {
            this.model = new Field(null, {
                urlRoot: this.url.replace('data/', 'fields/')
            });
            var that = this,
                ordering = this.columns.at(this.columns.length - 1).get("ordering") + 1,
                FormClass = EditForm.extend({
                    schema: this.model.getFormSchema(this.dataTypes)
                }),
                addColumnForm = new FormClass({
                    model: this.model
                }).render();

            this.model.set("ordering", ordering);
            this.modal = new Backbone.BootstrapModal({
                content: addColumnForm
            }).open();
            this.modal.on('ok', function () {
                addColumnForm.commit();
                that.model.url = that.columns.url;
                that.model.save();
                that.columns.add(that.model);
                console.log(that.model);
                that.columns.trigger('column-added');
            });
        },
        destroy: function () {
            this.undelegateEvents();
            this.$el = null;
        }
    });
    return ColumnManager;
});
