define([
		"lib/external/backbone-min",
		"backgrid"
	], function(Backbone, Backgrid) {
	var DataGrid = Backbone.View.extend({
		el: "#grid",
		records: null,
		columns: null,
		columnWidth: 160,
		grid: null,
		initialize: function(opts) {
			// opts should initialize the Grid with a collection of
			// columns and a collection of records.
			opts = opts || {};
			$.extend(this, opts);
			this.loadGrid();
		},
		loadGrid: function(){
			this.grid = new Backgrid.Grid({
				columns: this.columns,
				collection: this.records
			});
			this.render();
		},
		render: function(){
			// Render the grid and attach the root to your HTML document
			this.$el.html(this.grid.render().el);
			this.initLayout();
		},
		initLayout: function(){
			this.$el.find('table').addClass('table-bordered');
			this.makeColumnsResizable();
			this.resize();
		},
		makeColumnsResizable: function(){
			$("#grid").find('table').css({
				'min-width': (this.columns.length*this.columnWidth) + "px"    
			})
			this.$el.find('table').colResizable({ disable: true }); //a hack to run garbage collection for resizable table
			this.$el.find('table').colResizable({ disable: false });	
		},
		resize: function(){
			console.log('resize me!');
			this.$el.height($('body').height() - 96);
		},
		insertRow: function(e) {
			this.grid.insertRow({
				project_id: 2
			});
			e.preventDefault();
		},
		insertColumn: function(columnDef) {
			this.$el.find('table').css({'width': 'auto'});
			this.$el.find('th').css({'width': 'auto'});
			this.grid.insertColumn([columnDef]);
			this.makeColumnsResizable();
		}
	});
	return DataGrid;
});
