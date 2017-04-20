define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/field-item.html"
], function ($, _, Handlebars, Marionette, FieldItemTemplate) {
    'use strict';
    var FieldChildView = Marionette.ItemView.extend({
        initialize: function (opts) {
            _.extend(this, opts);
        },
        events: {
            'click .delete-field': 'doDelete'
        },
        template: Handlebars.compile(FieldItemTemplate),
        tagName: "tr",
        id: function () {
            return "row_" + this.model.get("id");
        },
        doDelete: function (e) {
            if (!confirm("Are you sure you want to remove this field from the form?")) {
                return;
            }
            var $elem = $(e.target),
                $row = $elem.parent().parent();
            $row.remove();

            this.model.destroy();
            e.preventDefault();
        }
    });
    return FieldChildView;

});
