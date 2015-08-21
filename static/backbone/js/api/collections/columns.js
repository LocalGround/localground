/* Useful Websites:
 * http://backgridjs.com/ref/column.html#getting-the-column-definitions-from-the-server
 http://stackoverflow.com/questions/13358477/override-backbones-collection-fetch
 */
var collection;
define([
    "jquery",
    "backgrid",
    "models/field",
    "lib/tables/cells/delete",
    "lib/tables/cells/image-cell",
    "lib/tables/cells/audio-cell",
    "lib/tables/formatters/lat",
    "lib/tables/formatters/lng"
], function ($, Backgrid, Field, DeleteCell, ImageCell, AudioCell, LatFormatter, LngFormatter) {
    "use strict";
    var Columns = Backgrid.Columns.extend({
            url: null,
            model: Field,
            initialize: function (opts) {
                opts = opts || {};
                var that = this;
                $.extend(this, opts);
                if (!this.url) {
                    alert("opts.url cannot be null");
                }
                this.fetch({set: true, success: function () {
                    that.addExtras();
                }});
                /*this.globalEvents.on("add-to-columns", function (model) {
                    console.log('added model:', model);
                    that.add(model);
                    model = that.conformRecordToModel(model);
                    that.trigger('render-grid');
                    //that.fetch({reset: true, success: function () {
                    //    that.addExtras();
                    //}});
                });*/
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
            addExtras: function () {
                var that = this,
                    getDummyID = function () {
                        return Math.floor(Math.random() * 10000);
                    },
                    cell1 = _.extend(Columns.getProjectCell(), {id: getDummyID() }),
                    cell2 = _.extend(Columns.getLngCell(), {id: getDummyID() }),
                    cell3 = _.extend(Columns.getLatCell(), {id: getDummyID() }),
                    cell4 = _.extend(Columns.getDeleteCell(), {id: getDummyID() });
                this.add(cell1, {at: 0});
                this.add(cell2, {at: 0});
                this.add(cell3, {at: 0});
                this.add(cell4, {at: 0});
                this.trigger('render-grid');
            }
        },
            // static methods are the second arguments.
            // Note that this class is made up primarily of
            // static methods:
            {
                defaultCellType: { cell: Backgrid.StringCell, width: 200 },
                getDefaultCell: function (name, opts) {
                    //alert(opts.type + " - " + Columns.cellTypeByNameLookup[opts.type]);
                    var defaultCell = {
                        name: name,
                        label: opts.label,
                        editable: !opts.read_only,
                        headerCell: Columns.HeaderCell
                    };
                    $.extend(defaultCell, Columns.getCellTypeByNameLookup[opts.type] || Columns.defaultCellType);
                    return defaultCell;
                },
                getProjectCell: function () {
                    return {
                        col_name: "project_id",
                        col_alias: "Project",
                        cell: Columns.wrapCell(Backgrid.SelectCell.extend({
                            optionValues: [["Project 2", "2"], ["Project 3", "3"]]
                        })),
                        editable: true,
                        width: 140,
                        headerCell: Columns.HeaderCell
                    };
                },
                getDeleteCell: function () {
                    return {
                        col_name: "delete",
                        col_alias: "delete",
                        editable: false,
                        cell: Columns.wrapCell(DeleteCell),
                        width: 100,
                        headerCell: Columns.HeaderCell
                    };
                },
                getLatCell: function () {
                    return {
                        col_name: "latitude",
                        col_alias: "Latitude",
                        cell: Columns.wrapCell(Backgrid.NumberCell),
                        formatter: LatFormatter,
                        editable: true,
                        width: 100,
                        headerCell: Columns.HeaderCell
                    };
                },
                getLngCell: function () {
                    return {
                        col_name: "longitude",
                        col_alias: "Longitude",
                        cell: Columns.wrapCell(Backgrid.NumberCell),
                        formatter: LngFormatter,
                        editable: true,
                        width: 100,
                        headerCell: Columns.HeaderCell
                    };
                },
                generateColumnsFromField: function (k, opts) {
                    var cols = [], cell, optionValues = [];
                    if (opts.type == 'geojson') {
                        cols.push(Columns.getLatCell());
                        cols.push(Columns.getLngCell());
                    } else if (opts.type === 'select') {
                        cols.push({
                            name: k,
                            label: opts.label,
                            cell: Backgrid.SelectCell.extend({
                                optionValues: opts.optionValues
                            }),
                            editable: true,
                            width: 150,
                            headerCell: Columns.wrapCell(Columns.HeaderCell)
                        });
                    } else if (opts.type == 'photo') {
                        cols.push({
                            name: k,
                            label: opts.label,
                            cell: ImageCell,
                            editable: true, //false
                            width: 140,
                            headerCell: Columns.wrapCell(Columns.HeaderCell)
                        });
                    } else if (opts.type == 'audio') {
                        cols.push({
                            name: k,
                            label: opts.label,
                            cell: AudioCell,
                            editable: true, //false,
                            width: 140,
                            headerCell: Columns.wrapCell(Columns.HeaderCell)
                        });
                    } else {
                        cell = Columns.getDefaultCell(k, opts);
                        if (k == 'id') {
                            cell.width = 30;
                        }
                        cols.push(cell);
                    }
                    return cols;
                },
                getCellTypeByNameLookup: function (key) {
                    var d = {
                        "integer": { cell: Columns.wrapCell(Backgrid.IntegerCell), width: 120 },
                        "field": { cell: Columns.wrapCell(Backgrid.StringCell), width: 200 },
                        "boolean": { cell: Columns.wrapCell(Backgrid.BooleanCell), width: 100 },
                        "decimal": { cell: Columns.wrapCell(Backgrid.NumberCell), width: 120 },
                        "date-time": { cell: Columns.wrapCell(Backgrid.DatetimeCell), width: 100 },
                        "rating": { cell: Columns.wrapCell(Backgrid.IntegerCell), width: 120 },
                        "string": { cell: Columns.wrapCell(Backgrid.StringCell), width: 200 },
                        "memo": { cell: Columns.wrapCell(Backgrid.StringCell), width: 200 },
                        "float": { cell: Columns.wrapCell(Backgrid.NumberCell), width: 120 }
                    };
                    return d[key];
                },
                wrapCell: function (Cell) {
                    //wraps each cell in an overflow div in order for column adjusting
                    //to work
                    var newCell = Cell.extend({
                        render: function () {
                            Cell.prototype.render.call(this, arguments);
                            var idx = this.$el.index(),
                                width = $('.backgrid').find("thead th:nth-child(" + (idx + 1) + ")").width();
                            //console.log(width);
                            this.$el.html(
                                $('<div class="hide-overflow"></div>')
                                    .append(this.$el.html())
                                    .width(width)
                            );
                            return this;
                        }
                    });
                    return newCell;
                },
                HeaderCell: Backgrid.HeaderCell.extend({
                    events: {
                        "click a.sorter": "onClick",
                        "click i.fa-trash-o": "deleteColumn"
                    },
                    deleteColumn: function () {
                        var collection = this.column.collection;
                        this.column.destroy();
                        collection.trigger('render-grid');
                    },
                    render: function () {
                        console.log("rendering header column", this.column, this.column.get("name"), this.column.name);
                        this.$el.empty();
                        var column = this.column,
                            sortable = Backgrid.callByNeed(column.sortable(), column, this.collection),
                            label;
                        if (sortable) {
                            label = $("<a class='sorter'>").text(column.get("name")).append("<b class='sort-caret'></b>");
                        } else {
                            label = document.createTextNode(column.get("label"));
                        }
                        this.$el.append(
                            $('<div class="column-menu"></div>')
                                //.html(column.get("label"))
                                .append($('<i class="fa fa-trash-o" style="cursor:pointer;"></i>'))
                        );
                        this.$el.append(label);
                        this.$el.addClass(column.get("name"));
                        this.$el.addClass(column.get("direction"));
                        this.delegateEvents();
                        return this;
                    }
                })
            });
    return Columns;
});
