define(["jquery", "backgrid"], function ($, Backgrid) {
    "use strict";
    var ImageCellEditor = Backgrid.InputCellEditor.extend({
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
        ImageCell = Backgrid.ImageCell = Backgrid.Cell.extend({
            className: "image-cell",
            editor: ImageCellEditor,
            render: function () {
                //alert("read only rendering");
                this.$el.empty();
                this.$el.html(this.renderImage());
                this.delegateEvents();
                return this;
            },
            renderImage: function () {
                var attr = this.column.get("name") + "_detail",
                    src;
                if (this.model.get(attr)) {
                    src = this.model.get(attr).file_name_small;
                    return '<img src="' + src + '" alt="" />';
                }
                return '<i class="fa fa-file-image-o fa-4x"></i>';
            }
        });
    return ImageCell;
});