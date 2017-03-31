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
            this.getDisplayField();
        },
        events: {
            'click .delete-field': 'doDelete'
        },
        template: Handlebars.compile(FieldItemTemplate),
        tagName: "tr",
        //*
        getDisplayField: function(){
            console.log(this.model.get("is_display_field"));
            console.log(this.$el);
            // I get context undefined each time I attempt to find class that holds the radio input
            var $displayFieldRadio = this.$el.find(".display_field_button");
            console.log($displayFieldRadio);
            //$displayFieldRadio.
        },
        //*/
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
