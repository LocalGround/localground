define(["backgrid"], function (Backgrid) {
    "use strict";
    var CustomRow = Backgrid.Row.extend({
        initialize: function (options) {
            this.listenTo(this.model, "change", function (model, options) {
                if (options && options.save === false) {
                    return;
                }
                model.save(model.changedAttributes(), {patch: true});
            });
            Backgrid.Row.prototype.initialize.call(this, options);
        }
    });
    return CustomRow;
});