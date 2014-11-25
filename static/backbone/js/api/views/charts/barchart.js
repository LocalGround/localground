/* Useful Websites:
 * http://backgridjs.com/ref/column.html#getting-the-column-definitions-from-the-server
 http://stackoverflow.com/questions/13358477/override-backbones-collection-fetch
 */
define([
    "jquery",
    "backbone",
    "views/charts/columns",
    "collections/records",
    "highcharts"
], function ($, Backbone, Columns, Records) {
    "use strict";
    var BarChart = Backbone.View.extend({
        url: null,
        collection: null,
        el: "#barchart",
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
            opts = opts || {};
            $.extend(this, opts);
            this.url = 'http://dev.localground.org/api/0/forms/7/data/';
            this.fetchColumns();
        },
        fetchColumns: function () {
            this.columns = new Columns({
                url: this.url
            });
            this.listenTo(this.columns, 'reset', this.fetchRecords);
            this.columns.fetch();
        },
        fetchRecords: function () {
            //console.log(this.columns);
            this.collection = new Records([], {
                url: this.url
            });
            this.collection.comparator = function (rec) {
                return rec.get("q19_time_in_seconds");
            };
            this.listenTo(this.collection, 'reset sort', this.render);
            this.collection.fetch({reset: true});
        },
        render: function () {
            var user_selection = "Percolation Time",
                labels = [],
                data = [];
            this.collection.each(function (rec) {
                labels.push(rec.get("team_members"));
                data.push({
                    y: rec.get("q19_time_in_seconds"),
                    color: (rec.get("q8_worm_count") >= 1) ? "#99FF99" : "#7cb5ec",
                    worm_count: rec.get("q8_worm_count")
                });
            });
            this.$el.highcharts({
                legend: false,
                chart: {
                    type: 'column'
                },
                title: {
                    text: user_selection
                },
                xAxis: {
                    categories: labels
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: user_selection
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table class="table table-condensed">',
                    pointFormat: '<tr><td>{series.name}: </td><td>{point.y}</td></tr>' +
                                 '<tr><td>worm count: </td><td>{point.worm_count}</td></tr>',
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
                        name: user_selection,
                        data: data
                    }
                ]
            });

        }
    });
    return BarChart;
});
