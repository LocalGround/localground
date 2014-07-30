define([
		"lib/external/backbone-min",
		"backgrid",
		"collections/records",
		"collections/columns",
		"collections/forms",
		"views/tableHeader",
		"lib/external/colResizable-1.3.source",
		
	], function(Backbone, Backgrid, Records, Columns, Forms, TableHeader) {
	var TableEditor = Backbone.View.extend({
		el: "#grid",
		tableHeader: null,
		url: null,
		events: {
			'click #add': 'insertRow',
			'click .change-table': 'loadNewTable'
		},
		initialize: function(opts) {
			opts = opts || {};
			$.extend(this, opts);
			var that = this;
			this.initLayout();
			this.forms = new Forms();
			this.tableHeader = new TableHeader({
				collection: this.forms,
				vent: this.vent
			});
			this.vent.on("loadNewTable", function(url){
				that.url = url + 'data/';
				that.fetchColumns();
			});
			
			this.vent.on("insertRow", function(e){
				that.insertRow(e);
			});
		},
		fetchColumns: function(){
			this.columns = new Columns({
				url: this.url + '.json'
			});
			this.columns.fetch();
			this.columns.on('reset', this.loadGrid, this);
		},
		loadGrid: function(){
			var records = new Records({
				url: this.url
			});
			this.grid = new Backgrid.Grid({
				columns: this.columns,
				collection: records
			});
			
			records.fetch({
				reset: true,
				data: {
					page_size: 100,
					format: 'json'
				}
			});
			
			this.render();
		},
		render: function(){
			// Render the grid and attach the root to your HTML document
			this.$el.html(this.grid.render().el);
			this.initLayout();
		},
		initLayout: function(){
			this.$el.height($('body').height() - 50);
			this.$el.find('table').addClass('table-bordered');
			this.$el.find('table').colResizable({ disable: true }); //a hack to run garbage collection for resizable table
			this.$el.find('table').colResizable({ disable: false });	
		},
		insertRow: function(e) {
			this.grid.insertRow({
				project_id: 9
			});
			e.preventDefault();
		}	
	});
	return TableEditor;
});
