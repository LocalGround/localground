define([
		"lib/external/backbone-min",
		"backgrid",
		"collections/records",
		"collections/columns",
		"collections/forms",
		"views/tableHeader",
		"lib/external/colResizable-1.3.source",
		"lib/external/backgrid-paginator-svw-debugged"
		
	], function(Backbone, Backgrid, Records, Columns, Forms, TableHeader) {
	var TableEditor = Backbone.View.extend({
		el: "#grid",
		tableHeader: null,
		paginator: null,
		url: null,
		columnWidth: '120',
		columns: null,
		records: null,
		events: {
			'click #add': 'insertRow',
			'click .change-table': 'loadNewTable'
		},
		initialize: function(opts) {
			opts = opts || {};
			$.extend(this, opts);
			var that = this;
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
			
			this.vent.on("requery", function(sql){
				that.getRecords({query: sql});
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
			var that = this;
			this.records = new Records({
				url: this.url
			});
			this.grid = new Backgrid.Grid({
				columns: this.columns,
				collection: this.records
			});
			this.paginator = new Backgrid.Extension.Paginator({
				collection: this.records,
				goBackFirstOnSort: true
			});
			this.getRecords();
			this.render();
		},
		getRecords: function(opts){
			opts = opts || {};
			$.extend(opts, {
				//page_size: 100,
				format: 'json'
			});
			this.records.fetch({
				reset: true,
				data: opts
			});
		},
		render: function(){
			// Render the grid and attach the root to your HTML document
			this.$el.html(this.grid.render().el);
			this.$el.append(this.paginator.render().el);
			this.initLayout();
		},
		initLayout: function(){
			this.$el.height($('body').height() - 50);
			this.$el.find('table').addClass('table-bordered');
			$('#grid').find('table').css({
				width: (this.columns.length*this.columnWidth) + "px"    
			});
			this.$el.find('table').colResizable({ disable: true }); //a hack to run garbage collection for resizable table
			this.$el.find('table').colResizable({ disable: false });	
		},
		insertRow: function(e) {
			this.grid.insertRow({
				project_id: 2
			});
			e.preventDefault();
		}	
	});
	return TableEditor;
});
