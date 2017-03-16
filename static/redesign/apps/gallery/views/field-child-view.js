define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/create-form.html",
    "text!../templates/field-item.html",
    "models/form",
    "collections/fields"
], function ($, _, Handlebars, Marionette, CreateFormTemplate, FieldItemTemplate, Form, Fields) {
    // Setting up a create form js
    'use strict';
    var FieldChildView =({

        // Work in progress

        getChildView: function () {
            // this child view is responsible for displaying
            // and deleting Field models:
            return Marionette.ItemView.extend({
                initialize: function (opts) {
                    _.extend(this, opts);
                },
                events: {
                    'click .delete-field': 'doDelete'
                },
                template: Handlebars.compile(FieldItemTemplate),
                tagName: "tr",
                doDelete: function (e) {
                    if (!confirm("Are you sure you want to remove this field from the form?")) {
                        return;
                    }
                    var $elem = $(e.target),
                    $row =  $elem.parent().parent();
                    $row.remove();

                    this.model.destroy();
                    e.preventDefault();
                },
                onRender: function () {
                    console.log(this.model.toJSON());
                }
            });
        },

    });
    return FieldChildView;

});
