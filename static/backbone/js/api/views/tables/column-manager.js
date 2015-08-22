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
        modelEvents: {
            'schema-ready': 'render'
        },
        initialize: function (opts) {
            _.extend(this, opts);
            this.ensureRequiredParam("url");
            this.ensureRequiredParam("columns");
            this.ensureRequiredParam("globalEvents");
            this.model = new Field(null, {
                urlRoot: this.url.replace('data/', 'fields/')
            });
            this.dataTypes.fetch({reset: true});
        },
        ensureRequiredParam: function (param) {
            if (!this[param]) {
                throw "\"" + param + "\" initialization parameter is required";
            }
        },
        render: function () {
            //console.log("schema ready");
            var that = this,
                modal,
                FormClass = EditForm.extend({
                    schema: this.model.getFormSchema(this.dataTypes)
                }),
                addColumnForm = new FormClass({
                    model: this.model
                }).render();

            modal = new Backbone.BootstrapModal({
                content: addColumnForm
            }).open();
            modal.on('ok', function () {
                console.log(that.columns, that.model);
                addColumnForm.commit();
                that.model.url = that.columns.url;
                that.model.save();
                that.columns.add(that.model);
                that.columns.trigger('render-grid');
                /*that.model.save(null, {success: function () {     //does database commit
                    alert('saving');
                    that.globalEvents.trigger("add-to-columns", that.model);
                    that.model.set("ordering", ++that.ordering);
                }});*/
            });
        },
        destroy: function () {
            this.undelegateEvents();
            this.$el = null;
        }
    });
    return ColumnManager;
});
