define([
		"lib/external/backbone-min",
		"backgrid",
		"collections/records",
		"collections/columns",
		"collections/forms",
		"views/tableHeader",
		"models/field",
		"lib/external/colResizable-1.3.source",
		"lib/external/backgrid-paginator-svw-debugged",
		"form",
		"bootstrap-form-templates",
		"backbone-bootstrap-modal"
		
	], function(Backbone, Backgrid, Records, Columns, Forms, TableHeader, Field) {
	var TableEditor = Backbone.View.extend({
		el: "#grid",
		tableHeader: null,
		paginator: null,
		url: null,
		columnWidth: '160',
		columns: null,
		records: null,
		grid: null,
		globalEvents: _.extend({}, Backbone.Events),
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
				globalEvents: this.globalEvents
			});
			this.globalEvents.on("loadNewTable", function(url){
				that.url = url + 'data/';
				that.fetchColumns();
			});
			
			this.globalEvents.on("insertRow", function(e){
				that.insertRow(e);
			});
			
			this.globalEvents.on("insertColumn", function(e){
				//1. define a new field:
				var field = new Field({
					urlRoot: that.url.replace('data/', 'fields/')
				});
				
				//2. generate the form that will be used to create the new field:
				field.on('schemaLoaded', function(){
					var form = new Backbone.Form({
						model: field
					}).render();
					var modal = new Backbone.BootstrapModal({ content: form }).open();
					modal.on('ok', function() {
						form.commit(); 	//does validation
						field.save();  	//does database commit
					});
				});
				
				//3. once the new field has been added to the database,
				//	 add it to the table:
				field.on('sync', function(){
					alert('saved!');
					return;
					/*var columnDef = {
						name: field.get("name"),
						label: field.get("name"),
						cell: field.get("data_type"),
						editable: true
					}
					that.insertColumn(columnDef);
					*/
				});
				
			});
			
			this.globalEvents.on("requery", function(sql){
				that.getRecords({query: sql});
			});
			
		},
		fetchColumns: function(){
			this.columns = new Columns({
				url: this.url
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
			this.makeGridResizable();
			
		},
		makeGridResizable: function(){
			$('#grid').find('table').css({
				'min-width': (this.columns.length*this.columnWidth) + "px"    
			});
			this.$el.find('table').colResizable({ disable: true }); //a hack to run garbage collection for resizable table
			this.$el.find('table').colResizable({ disable: false });	
		},
		insertRow: function(e) {
			this.grid.insertRow({
				project_id: 2
			});
			e.preventDefault();
		},
		insertColumn: function(columnDef) {
			$('#grid').find('table').css({'width': 'auto'});
			$('#grid').find('th').css({'width': 'auto'});
			this.grid.insertColumn([columnDef]);
			this.makeGridResizable();
		}
	});
	return TableEditor;
});
