define(["jquery", "backgrid"], function ($, Backgrid) {
    "use strict";
    var ImageCell = Backgrid.ImageCell = Backgrid.Cell.extend({
        className: "image-cell",
        render: function () {
            this.$el.empty();
            var $el = $("<div></div>").append(this.renderImage(this.model));
            $el.css({
                display: 'block',
                overflow: 'hidden',
                width: '20px',
                height: '90px'
            });
            this.$el.html($el);
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