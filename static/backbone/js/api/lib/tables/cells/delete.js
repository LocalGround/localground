define(["backgrid", "underscore"], function (Backgrid, _) {
    "use strict";
    /**
     * Extends Backgrid.Cell. When cell clicked, the underlying model is deleted.
     * @class DeleteCell
     */
    var DeleteCell = Backgrid.Cell.extend({
        className: "delete-cell",
        template: _.template('<i class="fa fa-trash-o delete-cell" style="cursor:pointer;"></i>'),
        events: {
            "click": "deleteRow"
        },
        deleteRow: function (e) {
            e.preventDefault();
            var message = "Are you sure that you want to permanently delete row (id=" + this.model.id + ")",
                doDelete = confirm(message);
            if (doDelete) {
                this.model.destroy();
            }
        },
        render: function () {
            this.$el.html(this.template());
            this.delegateEvents();
            return this;
        }
    });
    return DeleteCell;
});