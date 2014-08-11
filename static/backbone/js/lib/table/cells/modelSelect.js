define(["backgrid",
		"collections/projects"],
	function(Backgrid, Projects) {
	var SelectCell = Backgrid.SelectCell.extend({
		// It's possible to render an option group or use a
		// function to provide option values too.
		optionValues: [['1','1']],
		collection: null,
		initialize: function(opts) {
			this.collection = new Projects();
			this.collection.fetch({reset: true});
			this.collection.on('reset', this.setOptions, this);
			SelectCell.__super__.initialize.apply(this, arguments);
		},
		setOptions: function(){
			//console.log("setting options");
			var that = this;
			this.optionValues = [];
			this.collection.each(function(model){
				that.optionValues.push([
					model.get("name"), model.get("id")
				]); 
			});
			this.render();
		}
    });
	return SelectCell;
});