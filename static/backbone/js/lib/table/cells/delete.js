define(["backgrid"], function(Backgrid) {
    /** 
     * Extends Backgrid.Cell. When cell clicked, the underlying model is deleted.
     * @class DeleteCell
     */
	localground.table.DeleteCell = Backgrid.Cell.extend({
		template: _.template('<i class="fa fa-trash-o" style="cursor:pointer;"></i>'),
		events: {
		  "click": "deleteRow"
		},
		deleteRow: function (e) {
			e.preventDefault();
			this.model.destroy();
		},
		render: function () {
			this.$el.html(this.template());
			this.delegateEvents();
			return this;
		}
	});
	return localground.table.DeleteCell;
});