/* Useful Websites:
 * http://backgridjs.com/ref/column.html#getting-the-column-definitions-from-the-server
 http://stackoverflow.com/questions/13358477/override-backbones-collection-fetch
 */
define([
    "jquery",
    "backgrid",
    "models/field",
    "lib/tables/cells/cell-helpers"
], function ($, Backgrid, Field, CellHelpers) {
    "use strict";
    var Columns = Backgrid.Columns.extend({
        url: null,
        model: Field,
        initialize: function (data, opts) {
            opts = opts || {};
            var that = this;
            $.extend(this, opts);
            if (!this.url) {
                alert("opts.url cannot be null");
            }
            this.fetch({set: true, data: { page_size: 100}, success: function () {
                that.addAdministrativeColumns();
            }});
        },
        parse: function (response) {
            return response.results;
        },
        showColumn: function (key) {
            // check that doesn't end with the string "_detail."
            if (!/(^\w*_detail$)/.test(key)) {
                return true;
            }
            return false;
        },
        addAdministrativeColumns: function () {
            console.log(this);
            var getDummyID = function () {
                    return Math.floor(Math.random() * 10000);
                },
                cell1 = _.extend(this.getProjectCell(), {id: getDummyID() }),
                cell2 = _.extend(this.getLngCell(), {id: getDummyID() }),
                cell3 = _.extend(this.getLatCell(), {id: getDummyID() }),
                cell4 = _.extend(this.getDeleteCell(), {id: getDummyID() });
            this.add(cell1, {at: 0});
            this.add(cell2, {at: 0});
            this.add(cell3, {at: 0});
            this.add(cell4, {at: 0});
            this.trigger('render-grid');
        },
        toJSON: function () {
            var json = [];
            this.each(function (model) {
                json.push({
                    id: model.get("id"),
                    col_name: model.get("col_name"),
                    col_alias: model.get("col_alias")
                });
            });
            return json;
        }
    });
    _.extend(Columns.prototype, CellHelpers);
    return Columns;
});
