/* Useful Websites:
 * //backgridjs.com/ref/column.html#getting-the-column-definitions-from-the-server
 //stackoverflow.com/questions/13358477/override-backbones-collection-fetch
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
                "geometry",
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
                var that = this,
                    i = 0,
                    cols = [
                        this.getDeleteCell()
                    ];
                $.each(fields, function (k, opts) {
                    if (!that.showColumn(k)) {
                        //iterate to next:
                        return;
                    }
                    if (opts.type == 'geojson') {
                        cols.push(that.getLatCell());
                        cols.push(that.getLngCell());
                    } else if (opts.type === 'select') {
                        cols.push({
                            name: k,
                            label: k,
                            cell: Backgrid.SelectCell.extend({
                                optionValues: opts.optionValues
                            }),
                            editable: true,
                            width: 150
                        });
                    } else if (opts.type == 'photo' && that.showColumn(k)) {
                        cols.push({
                            name: k,
                            label: k,
                            cell: ImageCell,
                            editable: true, //false
                            width: 140
                        });
                    } else if (opts.type == 'audio') {
                        cols.push({
                            name: k,
                            label: k,
                            cell: AudioCell,
                            editable: true, //false,
                            width: 140
                        });
                    } else {
                        var cell = that.getDefaultCell(k, opts);
                        if (k == 'id') {
                            cell.width = 30;
                        }
                        cols.push(cell);
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
            },

            getDeleteCell: function () {
                return {
                    name: "delete",
                    label: "delete",
                    editable: false,
                    cell: DeleteCell,
                    width: 40
                };
            },
            getLatCell: function () {
                return {
                    name: "geometry",
                    label: "Latitude",
                    cell: Backgrid.NumberCell,
                    formatter: LatFormatter,
                    editable: true,
                    width: 80
                };
            },
            getLngCell: function () {
                return {
                    name: "geometry",
                    label: "Longitude",
                    cell: Backgrid.NumberCell,
                    formatter: LngFormatter,
                    editable: true,
                    width: 80
                };
            },
            getDefaultCell: function (name, opts) {
                //alert(opts.type + " - " + Columns.cellTypeByNameLookup[opts.type]);
                var defaultCell = {
                    name: name,
                    label: name,
                    editable: !opts.read_only
                };
                $.extend(defaultCell, Columns.cellTypeByNameLookup[opts.type]);
                return defaultCell;
            }
        },
        //static methods are the second arguments:
            {
                cellTypeByNameLookup: {
                    "integer": { cell: Backgrid.IntegerCell, width: 120 },
                    "field": { cell: Backgrid.StringCell, width: 200 },
                    "boolean": { cell: Backgrid.BooleanCell, width: 100 },
                    "decimal": { cell: Backgrid.NumberCell, width: 120 },
                    "date-time": { cell: Backgrid.DatetimeCell, width: 100 },
                    "rating": { cell: Backgrid.IntegerCell, width: 120 },
                    "string": { cell: Backgrid.StringCell, width: 200 },
                    "float": { cell: Backgrid.NumberCell, width: 120 }
                },
                cellTypeByIdLookup: {
                    "1": Backgrid.SelectCell, //"string",
                    "2": Backgrid.IntegerCell,
                    "3": Backgrid.DatetimeCell,
                    "4": Backgrid.BooleanCell,
                    "5": Backgrid.NumberCell,
                    "6": Backgrid.IntegerCell
                }
            });
    return Columns;
});
