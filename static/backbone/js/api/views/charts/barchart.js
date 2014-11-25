/* Useful Websites:
 * http://backgridjs.com/ref/column.html#getting-the-column-definitions-from-the-server
 http://stackoverflow.com/questions/13358477/override-backbones-collection-fetch
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
    _.extend(Records.prototype, {
        // Comma separated list of attributes
        sortColumn: null,
        // Comma separated list corresponding to column list
        sortDirection: 'asc', // - [ 'asc'|'desc' ]
        comparator: function (a, b) {
            if (!this.sortColumn) {
                return 0;
            }
            var cols = this.sortColumn.split(','),
                dirs = this.sortDirection.split(','),
                cmp;
            // First column that does not have equal values
            cmp = _.find(cols, function (c) {
                return a.attributes[c] != b.attributes[c];
            });
            // undefined means they're all equal, so we're done.
            if (!cmp) {
                return 0;
            }
            // Otherwise, use that column to determine the order
            // match the column sequence to the methods for ascending/descending
            // default to ascending when not defined.
            if ((dirs[_.indexOf(cols, cmp)] || 'asc').toLowerCase() == 'asc') {
                return (a.attributes[cmp] > b.attributes[cmp]) ? 1 : -1;
            } else {
                return a.attributes[cmp] < b.attributes[cmp] ? 1 : -1;
            }
        }
    });
    var BarChart = Backbone.View.extend({
        url: null,
        collection: null,
        el: "#barchart",
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
            this.url = 'http://dev.localground.org/api/0/forms/7/data/';
            that.fetchRecords();
            this.globalEvents.on("loadChart", function (variable) {
                that.dynamicVariable = variable;
                /*that.collection.comparator = function (rec) {
                    //return rec.get(that.dynamicVariable);
                    //return -rec.get(that.stayVariable);
                    //http://www.benknowscode.com/2013/12/multi-column-sort-in-backbone-collections.html
                    //return [rec.get(that.stayVariable), rec.get(that.dynamicVariable)];
                };*/
                that.collection.sortColumn = that.stayVariable + ',' + that.dynamicVariable;
                that.collection.sortDirection = 'desc,asc';
                that.collection.sort();
                that.collection.sort();
            });
        },
        fetchRecords: function () {
            //console.log(this.columns);
            //var that = this;
            this.collection = new Records([], {
                url: this.url
            });
            this.listenTo(this.collection, 'sort', this.render);
            this.collection.fetch();
        },
        render: function () {
            if (!this.dynamicVariable) {
                return;
            }
            var that = this,
                //user_selection = this.stayVariable,
                labels = [],
                data = [];
            this.collection.each(function (rec) {
                labels.push(rec.get(that.displayVariable));
                data.push({
                    y: rec.get(that.dynamicVariable),
                    color: that.colorRule(rec),
                    worm_count: rec.get(that.stayVariable)
                });
            });
            this.$el.highcharts({
                legend: false,
                chart: {
                    type: 'column'
                },
                title: {
                    text: this.dynamicVariable
                },
                xAxis: {
                    categories: labels
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: this.dynamicVariable
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table class="table table-condensed">',
                    pointFormat: '<tr><td>' + this.dynamicVariable + ': </td><td>{point.y}</td></tr>' +
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
