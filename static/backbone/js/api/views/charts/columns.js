/* Useful Websites:
 * http://backgridjs.com/ref/column.html#getting-the-column-definitions-from-the-server
 http://stackoverflow.com/questions/13358477/override-backbones-collection-fetch
 */
define([
    "jquery",
    "backbone"
], function ($, Backbone) {
    "use strict";
    var Columns = Backbone.Collection.extend({
            url: null,
            excludeList: [
                "overlay_type",
                "url",
                "manually_reviewed",
                "geometry",
                "num",
                "display_name",
                "id", //for now
                "project_id"
            ],
            initialize: function (opts) {
                opts = opts || {};
                $.extend(this, opts);
                if (!this.url) {
                    alert("opts.url cannot be null");
                }
            },
            fetch: function () {
                /* Queries the Django REST Framework OPTIONS
                 * page, which returns the API's schema as well
                 * as the filterable columns.
                 */
                var that = this,
                    cols;

                $.ajax({
                    // Note: the json must be appended in order for the OPTIONS
                    // query to return JSON (it ignores the 'format' parameter)
                    url: this.url + '.json',
                    type: 'OPTIONS',
                    data: { _method: 'OPTIONS' },
                    success: function (data) {
                        cols = that.getColumnsFromData(data.actions.POST);
                        that.reset(cols);
                    }
                });
            },
            showColumn: function (key) {
                // check that not in exclude list and that doesn't end with the string
                // "_detail."
                if (this.excludeList.indexOf(key) === -1 && !/(^\w*_detail$)/.test(key)) {
                    return true;
                }
                return false;
            },
            getColumnsFromData: function (fields) {
                var cols = [];
                $.each(fields, function (k) {
                    cols.push({
                        name: k,
                        label: k
                    });
                });
                return cols;
            }
        });
    return Columns;
});
