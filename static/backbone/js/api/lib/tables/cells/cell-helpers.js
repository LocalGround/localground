define([
    "jquery",
    "backgrid",
    "lib/tables/cells/delete",
    "lib/tables/cells/image-cell",
    "lib/tables/cells/audio-cell",
    "lib/tables/cells/coordinate-cell",
    "lib/tables/formatters/coordinate-formatter"
], function ($, Backgrid, DeleteCell, ImageCell, AudioCell, CoordinateCell, CoordinateFormatter) {
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
                "lat": CoordinateCell.extend({ columnName: "lat" }),
                "lng": CoordinateCell.extend({ columnName: "lng" }),
                "photo": this.wrapCell(ImageCell),
                "audio": this.wrapCell(AudioCell),
                "project": this.wrapCell(Backgrid.SelectCell.extend({
                    className: "project-cell",
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
                display_width: 100
            };
        },
        getDeleteCell: function () {
            return {
                data_type: "delete",
                col_name: "delete",
                col_alias: "delete",
                editable: false,
                display_width: 50
            };
        },
        getLatCell: function () {
            return {
                data_type: "lat",
                col_name: "latitude",
                col_alias: "Latitude",
                formatter: _.extend({}, CoordinateFormatter, { columnName: "latitude" }),
                editable: true,
                display_width: 80
            };
        },
        getLngCell: function () {
            return {
                data_type: "lng",
                col_name: "longitude",
                col_alias: "Longitude",
                formatter: _.extend({}, CoordinateFormatter, { columnName: "longitude" }),
                editable: true,
                display_width: 80
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
        }
    };
    return helpers;
});