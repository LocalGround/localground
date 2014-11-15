define(["jquery", "backgrid"], function ($, Backgrid) {
    "use strict";
    var AudioCellEditor = Backgrid.InputCellEditor.extend({
            render: function () {
                //alert("write only rendering");
                var id = this.getImageID();
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
        }),
        AudioCell = Backgrid.ImageCell = Backgrid.Cell.extend({
            className: "image-cell",
            editor: AudioCellEditor,
            render: function () {
                this.$el.empty();
                this.$el.html(this.renderPlayer());
                this.delegateEvents();
                return this;
            },
            renderPlayer: function () {
                var attr = this.column.get("name") + "_detail",
                    href;
                if (this.model.get(attr)) {
                    href = this.model.get(attr).file_path;
                    return '<a href="' + href + '" target="_blank"><i class="fa fa-volume-up"></i> listen</a>';
                }
                return '<i class="fa fa-volume-up fa-4x"></i>';
            }
        });
    return AudioCell;
});