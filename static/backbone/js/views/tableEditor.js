define([
		"lib/external/backbone-min",
		"backgrid",
		"collections/records",
		"lib/external/colResizable-1.3.source"
	], function(Backbone, Backgrid, Records) {
	var TableEditor = Backbone.View.extend({
		el: "#grid",
		events: {
			'click #add': 'insertRow'
		},
		initialize: function(opts) {
			opts = opts || {};
			$.extend(this, opts);
			var records = new Records();
			
			var CaptionFooter = Backgrid.Footer.extend({
				render: function () {
					this.el.innerHTML = '<button id="add">Add</button>'
					return this;
				}
			});
			
			this.grid = new Backgrid.Grid({
				columns: records.columns,
				collection: records,
				footer: CaptionFooter
			});
			
			records.fetch({
				reset: true,
				data: {
					page_size: 100,
					format: 'json'
				}
			});
			
			this.render();
			this.initLayout();
		},
		
		render: function(){
			// Render the grid and attach the root to your HTML document
			this.$el.append(this.grid.render().el);
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
