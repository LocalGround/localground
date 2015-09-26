define(["backgrid"], function (Backgrid) {
    "use strict";
    var AudioCellEditor = Backgrid.InputCellEditor.extend({
        render: function () {
            //var id = this.getImageID();
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
    return AudioCellEditor;
});