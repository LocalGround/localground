define([
    "jquery",
    "underscore",
    "backgrid",
    "text!/static/backbone/js/templates/modals/imageModal.html"
], function ($, _, Backgrid, ModalTemplate) {
    "use strict";
    var ImageCellEditor = Backgrid.InputCellEditor.extend({
            render: function () {
                //alert("write only rendering");
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
        }),
        ImageCell = Backgrid.ImageCell = Backgrid.Cell.extend({
            className: "image-cell",
            editor: ImageCellEditor,
            events: _.extend(Backgrid.Cell.prototype.events, {
                "click button": "showImage"
            }),
            render: function () {
                //alert("read only rendering");
                this.$el.empty();
                this.$el.html(this.renderImage());
                this.delegateEvents();
                return this;
            },
            renderImage: function () {
                var attr = this.column.get("name") + "_detail",
                    src,
                    $img,
                    $divContainer,
                    $div,
                    $more;
                if (this.model.get(attr)) {
                    src = this.model.get(attr).file_name_small;
                    $divContainer = $('<div></div>');
                    $div = $('<div></div>').addClass("button-footer");
                    $img =  $('<img src="' + src + '" alt="" />');
                    $more = '<button class="btn btn-hide"><i class="fa fa-external-link more"></i></button>';
                    return $divContainer.append($img).append($div.append($more));
                }
                return '<i class="fa fa-file-image-o fa-4x"></i>';
            },
            showImage: function (e) {
                var attr = this.column.get("name") + "_detail",
                    template = _.template(ModalTemplate, {
                        content: this.model.get(attr).file_name_medium
                    });
                $('body').find('#image-modal').remove();
                $('body').append(template);
                $('#image-modal').modal();
                e.preventDefault();
                return false;
            }
        });
    return ImageCell;
});