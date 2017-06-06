define([
    "jquery",
    "backbone",
    "underscore",
    "form",
    "form-list",
    "lib/forms/backbone-form-editors"
], function ($, Backbone, _) {
    "use strict";
    var DataForm = Backbone.Form.extend({
        initialize: function (options) {
            _.extend(this, options);
            Backbone.Form.prototype.initialize.call(this, options);
        },
        render: function () {
            Backbone.Form.prototype.render.call(this);
            this.removeLabelFromMediaEditor();
            return this;
        },
        removeLabelFromMediaEditor: function () {
            //super hacky; not proud of this:
            this.$el.find("label").each(function () {
                if ($(this).attr("for").indexOf("children") != -1) {
                    $(this).remove();
                }
            });
        }
    });
    return DataForm;
});
