/* Useful Websites:
 * http://backgridjs.com/ref/column.html#getting-the-column-definitions-from-the-server
 http://stackoverflow.com/questions/13358477/override-backbones-collection-fetch
 */
define([
    "backgrid",
    "models/field",
    "lib/tables/cells/cell-helpers"
], function (Backgrid, Field, CellHelpers) {
    "use strict";
    var Columns = Backgrid.Columns.extend({
        url: null,
        model: Field,
        initialize: function (data, opts) {
            try { this.url = opts.url; } catch (e) {}
            if (!this.url) {
                throw new Error("opts.url cannot be null");
            }
            this.on('reset', this.addAdministrativeColumns, this);
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
        }/*,
        toJSON: function () {
            var json = [];
            this.each(function (model) {
                json.push(model.toJSON());
            });
            return json;
        }*/
    });
    _.extend(Columns.prototype, CellHelpers);
    return Columns;
});
