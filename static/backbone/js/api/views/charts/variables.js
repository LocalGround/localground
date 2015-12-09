/* Useful Websites:
 * //backgridjs.com/ref/column.html#getting-the-column-definitions-from-the-server
 //stackoverflow.com/questions/13358477/override-backbones-collection-fetch
 */
define([
    "jquery",
    "backbone",
    "views/charts/columns",
    "collections/records",
    "highcharts"
], function ($, Backbone, Columns) {
    "use strict";
    var VariableSelector = Backbone.View.extend({
        url: null,
        collection: null,
        globalEvents: null,
        el: "#variable_container",
        activeVariable: "q8_worm_count",
        excludeList: [
            "overlay_type",
            "url",
            "manually_reviewed",
            "geometry",
            "num",
            "display_name",
            "id",
            "project_id"
        ],
        events: {
            'change #variable_select': 'triggerLoadChart'
        },
        initialize: function (opts) {
            var that = this;
            opts = opts || {};
            $.extend(this, opts);
            this.url = '//dev.localground.org/api/0/forms/7/data/';
            this.collection = new Columns({
                url: this.url,
                globalEvents: this.globalEvents
            });
            this.globalEvents.on("variablesLoaded", function () {
                that.render();
            }, this);
            this.collection.fetch();
        },
        render: function () {
            var that = this;
            this.collection.each(function (field) {
                if (field.type == "integer" && that.showVariable(field.name)) {
                    that.$el.find("select").append($('<option value="' + field.name + '">' + field.name + '</option>'));
                }
            });
        },
        showVariable: function (name) {
            // check that not in exclude list and that doesn't end with the string
            // "_detail."
            if (this.excludeList.indexOf(name) === -1 && !/(^\w*_detail$)/.test(name)) {
                return true;
            }
            return false;
        },
        triggerLoadChart: function (e) {
            this.globalEvents.trigger("loadChart", this.$el.find("select").val());
            e.preventDefault();
        }
    });
    return VariableSelector;
});
