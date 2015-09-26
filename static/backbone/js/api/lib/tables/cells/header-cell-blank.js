define([
    "jquery",
    "backgrid"
], function ($, Backgrid) {
    "use strict";
    var HeaderCellBlank = Backgrid.HeaderCell.extend({
        render: function () {
            HeaderCellBlank.__super__.render.apply(this);
            this.$el.prepend($('<div class="column-menu"></div>'));
            this.$el.find('a').addClass('sorter');
            return this;
        }
    });
    return HeaderCellBlank;
});