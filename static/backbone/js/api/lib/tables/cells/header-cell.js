define([
    "jquery",
    "backgrid"
], function ($, Backgrid) {
    "use strict";
    var HeaderCell = Backgrid.HeaderCell.extend({
        events: {
            "click a.sorter": "onClick",
            "click i.fa-trash-o": "deleteColumn"
        },
        deleteColumn: function () {
            var response = confirm(
                    "Are you sure you want to permanently delete the \"" +
                        this.column.get("col_alias") + "\" column?"
                );
            if (response) { this.deleteColumnConfirmed(); }
        },
        deleteColumnConfirmed: function () {
            var collection = this.column.collection;
            //hack: need to pass dataType: "text" in order to trigger the success callback:
            this.column.destroy({ dataType: "text", success: function () {
                collection.trigger('schema-updated');
            }});
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
    });
    return HeaderCell;
});