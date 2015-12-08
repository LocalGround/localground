/* Useful Websites:
 * //backgridjs.com/ref/column.html#getting-the-column-definitions-from-the-server
 //stackoverflow.com/questions/13358477/override-backbones-collection-fetch
 */
define([
    "underscore",
    "jquery",
    "backbone",
    "views/charts/variables",
    "collections/records",
    "highcharts"
], function (_, $, Backbone, VariableSelector, Records) {
    "use strict";
    var BarChart = Backbone.View.extend({
        url: null,
        collection: null,
        el: "#charts",
        globalEvents: _.extend({}, Backbone.Events),
        dynamicVariable: null,
        stayVariable: "q8_worm_count",
        displayVariable: "team_members",
        colorRule: function (rec) {
            return (rec.get(this.stayVariable) >= 1) ? "#99FF99" : "#7cb5ec";
        },
        changeVariable: null,
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
        initialize: function (opts) {
            var that = this;
            $.extend(this, opts);
            this.variableSelector = new VariableSelector({
                globalEvents: this.globalEvents
            });
            this.url = '//dev.localground.org/api/0/forms/7/data/';
            that.fetchRecords();
            this.globalEvents.on("loadChart", function (variable) {
                that.dynamicVariable = variable;
                that.collection.comparator = function (rec) {
                    return rec.get(that.dynamicVariable);
                };
                that.collection.sort();
            });
        },
        fetchRecords: function () {
            this.collection = new Records([], {
                url: this.url
            });
            this.listenTo(this.collection, 'sort', this.render);
            this.collection.fetch();
        },
        render: function () {
            var that = this;
            this.renderChart(this.$el.find("#chart1"), function (rec) {
                return rec.get(that.stayVariable) > 0;
            }, this.dynamicVariable + "<br />(at least one worm)");
            this.renderChart(this.$el.find("#chart2"), function (rec) {
                return rec.get(that.stayVariable) == 0;
            }, this.dynamicVariable + "<br />(no worms)");
        },
        renderChart: function ($el, condition, title) {
            if (!this.dynamicVariable) {
                return;
            }
            var that = this,
                labels = [],
                data = [],
                maxVal = 0;
            this.collection.each(function (rec) {
                if (condition(rec)) {
                    labels.push(rec.get(that.displayVariable));
                    data.push({
                        y: rec.get(that.dynamicVariable),
                        color: that.colorRule(rec),
                        worm_count: rec.get(that.stayVariable),
                        pic: rec.get("team_photo_detail").file_name_small
                    });
                }
                maxVal = Math.max(maxVal, rec.get(that.dynamicVariable));
            });
            $el.highcharts({
                legend: false,
                chart: {
                    type: 'column'
                },
                title: {
                    text: title
                },
                xAxis: {
                    categories: labels
                },
                yAxis: {
                    min: 0,
                    max: maxVal,
                    title: {
                        text: this.dynamicVariable
                    }
                },
                tooltip: {
                    headerFormat: '<table class="table table-condensed">',
                    pointFormat: '<tr><td colspan="2" style="height: 90px;"><img src="{point.pic}"/></td></tr>' +
                                 '<tr><td>' + this.dynamicVariable + ': </td><td>{point.y}</td></tr>' +
                                 '<tr><td>' + this.stayVariable + ': </td><td>{point.worm_count}</td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [
                    {
                        name: that.displayVariable,
                        data: data
                    }
                ]
            });

        }
    });
    return BarChart;
});
