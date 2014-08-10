define([
		"lib/external/backbone-min",
		"backgrid",
		"collections/records",
		"collections/columns",
		"collections/forms",
		"views/tables/tableHeader",
		"views/tables/datagrid",
		"models/field",
		"lib/external/colResizable-1.3.source",
		"lib/external/backgrid-paginator-svw-debugged",
		"form",
		"bootstrap-form-templates",
		"backbone-bootstrap-modal"
		
	], function(Backbone, Backgrid, Records, Columns, Forms, TableHeader, DataGrid, Field) {
	var TableEditor = Backbone.View.extend({
		el: "body",
		tableHeader: null,
		paginator: null,
		url: null,
		columns: null,
		records: null,
		datagrid: null,
		globalEvents: _.extend({}, Backbone.Events),
		events: {
			'click #add': 'insertRow',
			'click .change-table': 'loadNewTable',
			//'resize': 'resize'
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
				that.grid.insertRow(e);
			});
			
			this.globalEvents.on("insertColumn", function(e){
				//1. define a new field:
				var field = new Field({
					urlRoot: that.url.replace('data/', 'fields/'),
					ordering: that.columns.length
				});
				
				//2. generate the form that will be used to create the new field:
				var form = new Backbone.Form({
					model: field
				}).render();
				var modal = new Backbone.BootstrapModal({ content: form }).open();
				modal.on('ok', function() {
					form.commit(); 	//does validation
					field.save();  	//does database commit
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
					that.grid.insertColumn(columnDef);
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
			this.columns.on('reset', this.render, this);
		},
		render: function(){
			var that = this;
			this.records = new Records({
				url: this.url
			});
			this.grid = new DataGrid({
				columns: this.columns,
				records: this.records
			});
			$(window).off('resize');
			$(window).on('resize', function(){
				that.grid.resize();	
			});
			
			this.paginator = new Backgrid.Extension.Paginator({
				collection: this.records,
				goBackFirstOnSort: true
			});
			this.getRecords();
			this.$el.find('.container-footer').html(this.paginator.render().el);
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
		}

	});
	return TableEditor;
});
