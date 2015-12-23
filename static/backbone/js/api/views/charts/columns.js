/* Useful Websites:
 * //backgridjs.com/ref/column.html#getting-the-column-definitions-from-the-server
 //stackoverflow.com/questions/13358477/override-backbones-collection-fetch
 */
define([
    "jquery",
    "backbone"
], function ($, Backbone) {
    "use strict";
    var Columns = Backbone.View.extend({
            url: null,
            globalEvents: null,
            fields: [],
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
                var that = this;

                $.ajax({
                    // Note: the json must be appended in order for the OPTIONS
                    // query to return JSON (it ignores the 'format' parameter)
                    url: this.url + '.json',
                    type: 'OPTIONS',
                    data: { _method: 'OPTIONS' },
                    success: function (data) {
                        that.setFields(data.actions.POST);
                    }
                });
            },
            setFields: function (fields) {
                this.fields = [];
                var key, val;
                for (key in fields) {
                    val = fields[key];
                    val.name = key;
                    this.fields.push(val);
                }
                this.globalEvents.trigger("variablesLoaded");
            },
            each: function (f) {
                var i = 0;
                for (i = 0; i < this.fields.length; i++) {
                    f(this.fields[i]);
                }
            }
        });
    return Columns;
});
