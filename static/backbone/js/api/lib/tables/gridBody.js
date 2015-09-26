define(["backgrid"], function (Backgrid) {
    "use strict";
    var GridBody = Backgrid.Body.extend({
        render: function () {
            var fragment = document.createDocumentFragment(),
                i,
                row;
            this.$el.empty();
            for (i = 0; i < this.rows.length; i++) {
                row = this.rows[i];
                fragment.appendChild(row.render().el);
            }
            this.el.appendChild(fragment);
            // custom code to notify view of a table re-rendering.
            if (this.rows.length > 0) {
                this.trigger("row:added", this);
            }
            this.delegateEvents();
            return this;
        }
    });
    return GridBody;
});