define(["backgrid", "lib/tables/cells/audio-cell-editor"], function (Backgrid, AudioCellEditor) {
    "use strict";
    var AudioCell = Backgrid.ImageCell = Backgrid.Cell.extend({
            className: "audio-cell",
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