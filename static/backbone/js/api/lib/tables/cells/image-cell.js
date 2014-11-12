define(["jquery", "backgrid"], function ($, Backgrid) {
    "use strict";
    var ImageCell = Backgrid.ImageCell = Backgrid.Cell.extend({
        className: "image-cell",
        render: function () {
            this.$el.empty();
            this.$el.html(this.renderImage(this.model));
            this.delegateEvents();
            return this;
        },

        renderImage: function (model) {
            var img = '';
            if (this.model.attributes.drawing1) {
                img = this.model.attributes.drawing1.file_name_small;
            }
            if (img.length > 1) {
                return '<img src="' + img + '" alt="" />';
            }
            return '<i class="fa fa-file-image-o fa-4x"></i>';
        }
	});
    return ImageCell;
});