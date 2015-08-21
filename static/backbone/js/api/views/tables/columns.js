/* Useful Websites:
 * http://backgridjs.com/ref/column.html#getting-the-column-definitions-from-the-server
 http://stackoverflow.com/questions/13358477/override-backbones-collection-fetch
 */
define([
    "jquery",
    "backgrid",
    "lib/tables/cells/delete",
    "lib/tables/cells/image-cell",
    "lib/tables/cells/audio-cell",
    "lib/tables/formatters/lat",
    "lib/tables/formatters/lng"
], function ($, Backgrid, DeleteCell, ImageCell, AudioCell, LatFormatter, LngFormatter) {
    "use strict";
    var Columns = Backgrid.Columns.extend({
            url: null,
            excludeList: [
                "overlay_type",
                "url",
                "manually_reviewed",
                //"geometry",
                "num",
                "display_name" //,
                //"id", //for now
                //"project_id"
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
                        cols = that.getColumns(data.actions.POST);
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
            getColumns: function (fields) {
                var that = this,
                    i = 0,
                    cols = [
                        Columns.getDeleteCell()
                    ];
                $.each(fields, function (k, opts) {
                    if (that.showColumn(k)) {
                        cols = cols.concat(Columns.generateColumnsFromField(k, opts));
                    }
                });

                //wrap each column in an overflow div:
                for (i = 0; i < cols.length; i++) {
                    cols[i].cell = this.wrapCell(cols[i].cell);
                }
                return cols;
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
                    $.extend(defaultCell, Columns.cellTypeByNameLookup[opts.type] || Columns.defaultCellType);
                    return defaultCell;
                },
                getDeleteCell: function () {
                    return {
                        name: "delete",
                        label: "delete",
                        editable: false,
                        cell: DeleteCell,
                        width: 40,
                        headerCell: Columns.HeaderCell
                    };
                },
                getLatCell: function () {
                    return {
                        name: "latitude",
                        label: "Latitude",
                        cell: Backgrid.NumberCell,
                        formatter: LatFormatter,
                        editable: true,
                        width: 80,
                        headerCell: Columns.HeaderCell
                    };
                },
                getLngCell: function () {
                    return {
                        name: "longitude",
                        label: "Longitude",
                        cell: Backgrid.NumberCell,
                        formatter: LngFormatter,
                        editable: true,
                        width: 80,
                        headerCell: Columns.HeaderCell
                    };
                },
                generateColumnsFromField: function (k, opts) {
                    console.log(opts);
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
                            headerCell: Columns.HeaderCell
                        });
                    } else if (opts.type == 'photo') {
                        cols.push({
                            name: k,
                            label: opts.label,
                            cell: ImageCell,
                            editable: true, //false
                            width: 140,
                            headerCell: Columns.HeaderCell
                        });
                    } else if (opts.type == 'audio') {
                        cols.push({
                            name: k,
                            label: opts.label,
                            cell: AudioCell,
                            editable: true, //false,
                            width: 140,
                            headerCell: Columns.HeaderCell
                        });
                    } else if (opts.type == 'field' && opts.choices) {
                        _.each(opts.choices, function (choice) {
                            optionValues.push([choice.display_name, choice.value]);
                        });
                        cols.push({
                            name: k,
                            label: opts.label,
                            cell: Backgrid.SelectCell.extend({
                                optionValues: optionValues
                            }),
                            editable: true,
                            width: 140,
                            headerCell: Columns.HeaderCell
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
                cellTypeByNameLookup: {
                    "integer": { cell: Backgrid.IntegerCell, width: 120 },
                    "field": { cell: Backgrid.StringCell, width: 200 },
                    "boolean": { cell: Backgrid.BooleanCell, width: 100 },
                    "decimal": { cell: Backgrid.NumberCell, width: 120 },
                    "date-time": { cell: Backgrid.DatetimeCell, width: 100 },
                    "rating": { cell: Backgrid.IntegerCell, width: 120 },
                    "string": { cell: Backgrid.StringCell, width: 200 },
                    "memo": { cell: Backgrid.StringCell, width: 200 },
                    "float": { cell: Backgrid.NumberCell, width: 120 }
                },
                cellTypeByIdLookup: {
                    "1": Backgrid.SelectCell, //"string",
                    "2": Backgrid.IntegerCell,
                    "3": Backgrid.DatetimeCell,
                    "4": Backgrid.BooleanCell,
                    "5": Backgrid.NumberCell,
                    "6": Backgrid.IntegerCell
                },
                HeaderCell: Backgrid.HeaderCell.extend({
                    events: {
                        "click a.sorter": "onClick"
                    },
                    render: function () {
                        this.$el.empty();
                        var column = this.column,
                            sortable = Backgrid.callByNeed(column.sortable(), column, this.collection),
                            label;
                        if (sortable) {
                            label = $("<a class='sorter'>").text(column.get("name")).append("<b class='sort-caret'></b>");
                        } else {
                            label = document.createTextNode(column.get("label"));
                        }
                        this.$el.append($('<div class="column-menu"></div>').html(column.get("label")));
                        this.$el.append(label);
                        this.$el.addClass(column.get("name"));
                        this.$el.addClass(column.get("direction"));
                        //this.$el.append($('<i class="fa fa-trash-o" style="cursor:pointer;"></i>'));
                        this.delegateEvents();
                        return this;
                    }
                })
            });
    return Columns;
});
