define(["backgrid"], function(Backgrid) {
    var DeleteCell = Backgrid.Cell.extend({
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
	return DeleteCell;
});