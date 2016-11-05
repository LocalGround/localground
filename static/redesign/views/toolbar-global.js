define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/toolbar-global.html"
], function ($, _, Handlebars, Marionette, ToolbarTemplate) {
    "use strict";
    var Toolbar = Marionette.ItemView.extend({
        events: {
            'click #map-link': 'test'
        },
        template: Handlebars.compile(ToolbarTemplate),

        initialize: function (opts) {
            _.extend(this, opts);
            this.model = this.app.selectedProject;
            /*if (!this.model) {
                alert("this.app.selectedProject must be defined");
            }*/
            //this.template = Handlebars.compile($('#toolbar-main').html());
            Marionette.ItemView.prototype.initialize.call(this);
        },

        onRender: function () {
            this.$el.find(".project-detail > div").css('display', 'inline-block');
        },

        test: function () {
            console.log("test");
        }
    });
    return Toolbar;
});