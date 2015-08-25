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
    var helpers = {
        getCell: function (type) {
            var d = {
                "integer": this.wrapCell(Backgrid.IntegerCell),
                "field": this.wrapCell(Backgrid.StringCell),
                "boolean": this.wrapCell(Backgrid.BooleanCell),
                "decimal": this.wrapCell(Backgrid.NumberCell),
                "date-time": this.wrapCell(Backgrid.DatetimeCell),
                "rating": this.wrapCell(Backgrid.IntegerCell),
                "string": this.wrapCell(Backgrid.StringCell),
                "memo": this.wrapCell(Backgrid.StringCell),
                "float": this.wrapCell(Backgrid.NumberCell),
                "photo": this.wrapCell(ImageCell),
                "audio": this.wrapCell(AudioCell),
                "project": this.wrapCell(Backgrid.SelectCell.extend({
                    optionValues: [["Project 2", "2"], ["Project 3", "3"]]
                })),
                "delete": this.wrapCell(DeleteCell)
            };
            return d[type] || Backgrid.StringCell;
        },
        getProjectCell: function () {
            return {
                data_type: "project",
                col_name: "project_id",
                col_alias: "Project",
                editable: true,
                width: 140
            };
        },
        getDeleteCell: function () {
            return {
                data_type: "delete",
                col_name: "delete",
                col_alias: "delete",
                editable: false,
                width: 100
            };
        },
        getLatCell: function () {
            return {
                data_type: "float",
                col_name: "latitude",
                col_alias: "Latitude",
                formatter: LatFormatter,
                editable: true,
                width: 100
            };
        },
        getLngCell: function () {
            return {
                data_type: "float",
                col_name: "longitude",
                col_alias: "Longitude",
                formatter: LngFormatter,
                editable: true,
                width: 100
            };
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
                collection.trigger('schema-updated');
            },
            render: function () {
                console.log("rendering header column");
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
    };
    return helpers;
});