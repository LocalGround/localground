define(["backgrid"], function (Backgrid) {
    "use strict";
    var ImageCellEditor = Backgrid.InputCellEditor.extend({
        render: function () {
            this.$el.val(this.getImageID());
            return this;
        },
        getImageID: function () {
            var attr = this.column.get("name");
            if (this.model.get(attr)) {
                return this.model.get(attr); //.id;
            }
            return null;
        }
    });
    return ImageCellEditor;
});