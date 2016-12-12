define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/form-list.html",
    "text!../templates/form-item.html",
    "models/form",
    "collections/forms"
], function ($, _, Handlebars, Marionette, FormListTemplate, FormItemTemplate, Form, Forms) {
    // Setting up a create form js
    'use strict';
    var FormListView = Marionette.CompositeView.extend({
        app: null,
        initialize: function (opts) {
            _.extend(this, opts);
            this.childViewOptions = {
                app: this.app
            };
            this.template = Handlebars.compile(FormListTemplate);
            this.collection = new Forms();
            //this.listenTo()
            this.collection.fetch({ reset: true });
            this.render();
        },

        events: {
            'click .add-new-form': 'showNewForm'
        },

        showNewForm: function () {
            this.app.vent.trigger('show-form');
        },
        childViewContainer: "#form-list",
        getChildView: function () {
            // this child view is responsible for displaying
            // and deleting Field models:
            return Marionette.ItemView.extend({
                initialize: function (opts) {
                    console.log(opts);
                    _.extend(this, opts);
                },
                events: {
                    'click .edit-form': 'showEditForm'
                },
                template: Handlebars.compile(FormItemTemplate),
                tagName: "tr",
                showEditForm: function (e) {
                    this.app.vent.trigger('show-form', {
                        model: this.model
                    });
                    e.preventDefault();
                },
                onRender: function () {
                    console.log(this.model.toJSON());
                }
            });
        }

    });
    return FormListView;

});
