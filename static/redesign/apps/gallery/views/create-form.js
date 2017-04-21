define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/create-form.html",
    "models/form",
    "models/field",
    "collections/fields",
    "apps/gallery/views/field-child-view",
    "jquery.ui"
], function ($, _, Handlebars, Marionette, CreateFormTemplate, Form, Field, Fields, FieldChildView) {
    'use strict';
    var CreateFormView = Marionette.CompositeView.extend({

        initialize: function (opts) {
            _.extend(this, opts);

            if (!this.model) {
                // Create a blank project if new project made
                this.model = new Form();
            } else {
                this.initModel();
            }
            this.template = Handlebars.compile(CreateFormTemplate);
            this.render();
        },
        initModel: function () {
            this.initCollection();
            Marionette.CompositeView.prototype.initialize.call(this);
            if (!this.collection || this.collection.isEmpty()) {
                this.fetchShareData();
            }
        },

        childViewContainer: "#fieldList",
        childViewOptions: function () {
            var opts = this.model.toJSON();
            delete opts.id;
            return opts;
        },
        childView: FieldChildView,
        template: Handlebars.compile(CreateFormTemplate),
        events: {
            'click .remove-row': 'removeRow',
            'click .new_field_button' : 'addFieldButton',
            'click .back': 'backToList'
        },
        onRender: function () {
            var sortableFields = this.$el.find("#fieldList"),
                that  = this;
            sortableFields.sortable({
                helper: this.fixHelper,
                update: function (event, ui) {
                    /*var newOrder = ui.item.index() + 1,
                        tempID = ui.item.attr("id"),
                        targetModel = that.collection.find(function (model) { return model.get('temp_id') === tempID; });
                    targetModel.set("ordering", newOrder);*/
                    var $rows = that.$el.find("#fieldList tr"),
                        tempID,
                        model,
                        childView;
                    $rows.each(function (i) {
                        tempID = $(this).attr("id");
                        model = that.collection.find(function (model) { return model.get('temp_id') === tempID; });
                        model.set("ordering", i + 1);
                    });
                    that.collection.sort();
                    that.render();
                    //targetModel.save();
                }
            }).disableSelection();
        },

        // Fix helper with preserved width of cells
        fixHelper: function (e, ui) {
            ui.children().each(function () {
                $(this).width($(this).width());
            });
            return ui;
        },
        fetchShareData: function () {
            this.model.getFields();
        },
        removeRow: function (e) { // to remove a field that has not yet been saved
            var $elem = $(e.target),
                $row =  $elem.parent().parent();
            if ($row.has('select').length != 0) {
                $row.remove();
            }
        },
        wait: function (ms) {
            var d = new Date(),
                d2 = null;
            do { d2 = new Date(); } while (d2 - d < ms);
        },
        saveFormSettings: function () {
            var formName = this.$el.find('#formName').val(),
                caption = this.$el.find('#caption').val(),
                that = this;
            this.model.set('name', formName);
            this.model.set('caption', caption);
            this.model.set('slug', 'slug_' + parseInt(Math.random() * 100000, 10));
            this.model.set('project_ids', [this.app.getProjectID()]);
            this.model.save(null, {
                success: function () {
                    that.saveFields();
                },
                error: function () {
                    console.log("The fields could not be saved");
                }
            });
        },

        initCollection: function () {
            if (this.collection) {
                return;
            }
            if (!this.model.fields) {
                this.model.fields = new Fields(
                    null,
                    { form: this.model }
                );
            }
            this.collection = this.model.fields;
        },

        saveFields: function () {
            this.initCollection();
            var that = this,
                $rows = this.$el.find("#fieldList tr"),
                tempID,
                model,
                childView;
            $rows.each(function (i) {
                tempID = $(this).attr("id");
                model = that.collection.find(function (model) { return model.get('temp_id') === tempID; });
                childView = that.children.findByModel(model);
                childView.saveField(i + 1);
                that.wait(300);
            });
        },
        addFieldButton: function () {
            this.initCollection();
            var field = new Field(null, { form: this.model });
            this.collection.add(field);
            if (this.collection.length == 1) {
                this.render();
            }
            this.render();
        },

        deleteForm: function () {
            console.log("Delete Form");
            var that = this;
            if (!confirm("Are you sure you want to delete this form? This will delete all data associated with this form and cannot be undone.")) {
                return;
            }
            this.model.destroy({
                success: function () {
                    that.backToList();
                }
            });
        },

        backToList: function () {
            this.app.vent.trigger("show-form-list");
        }
    });
    return CreateFormView;

});
