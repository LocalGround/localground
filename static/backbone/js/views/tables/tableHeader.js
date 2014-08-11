define([
		"lib/external/backbone-min"
	], function(Backbone) {
	var TableHeader = Backbone.View.extend({
		el: "#navbar",
		globalEvents: null,
		events: {
			'click .change-table': 'triggerLoadTable',
			'click #add_row_top': 'triggerInsertRowTop',
			'click #add_row_bottom': 'triggerInsertRowBottom',
			'click .query': 'triggerQuery',
			'click .clear': 'triggerClearQuery',
			'click #add_column': 'triggerInsertColumn'
		},
		initialize: function(opts) {
			opts = opts || {};
			$.extend(this, opts);
			this.loadFormSelector();
		},
			
		loadFormSelector: function(){
			var that = this;
			this.collection.fetch({success: function(response) {
				that.globalEvents.trigger("loadNewTable", that.collection.at(0).get("url"));
				var $tbl = that.$el.find('#tableSelect')
				$tbl.empty();
				$.each(that.collection.models, function(){
					$tbl.append(
						$('<li></li>').append(
							$('<a class="change-table"></a>')
								.html(this.get("name"))
								.attr("href", this.get("url"))
							)
						);	
				});
				$('.dropdown-toggle').dropdown();
			}});
		},
		triggerLoadTable: function(e){
			this.globalEvents.trigger("loadNewTable", $(e.currentTarget).attr("href"));
			e.preventDefault();
		},
		triggerInsertRowTop: function(e){
			this.globalEvents.trigger("insertRowTop", e);
			e.preventDefault();	
		},
		triggerInsertRowBottom: function(e){
			this.globalEvents.trigger("insertRowBottom", e);
			e.preventDefault();	
		},
		triggerQuery: function(e){
			var sql = this.$el.find('#query_text').val();
			this.globalEvents.trigger("requery", sql);
			e.preventDefault();	
		},
		triggerClearQuery: function(e){
			this.$el.find('#query_text').val("")
			this.triggerQuery(e);
		},
		triggerInsertColumn: function(e) {
			this.globalEvents.trigger("insertColumn", e);
		}
	});
	return TableHeader;
});