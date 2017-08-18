define(["backgrid", "collections/projects"], function (Backgrid, Projects) {
    "use strict";
    /**
     * Helper Class for BackGrid Select menu. Currently not used.
     * @class SelectCell
     * @property {Array of Arrays}  optionValues - A list of available options from which to choose.
     */
    var SelectCell = Backgrid.SelectCell.extend({
        optionValues: [
            ['1', '1']
        ],
        collection: null,
        initialize: function (opts) {
            this.collection = new Projects();
            this.collection.fetch({reset: true});
            this.collection.on('reset', this.setOptions, this);
            SelectCell.__super__.initialize.apply(this, arguments);
        },
        setOptions: function () {
            var that = this;
            this.optionValues = [];
            this.collection.each(function (model) {
                that.optionValues.push([
                    model.get("name"), model.get("id")
                ]);
            });
            this.render();
        }
    });
    return SelectCell;
});