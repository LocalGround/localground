define([
		"lib/external/backbone-min"
	], function(Backbone) {
	var TableHeader = Backbone.View.extend({
		el: "#navbar",
		vent: null,
		events: {
			'click .change-table': 'triggerLoadTable',
			'click #add_row': 'triggerInsertRow'
		},
		initialize: function(opts) {
			opts = opts || {};
			$.extend(this, opts);
			this.loadFormSelector();
		},
			
		loadFormSelector: function(){
			var that = this;
			this.collection.fetch({success: function(response) {
				that.vent.trigger("loadNewTable", that.collection.at(0).get("url"));
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
			this.vent.trigger("loadNewTable", $(e.currentTarget).attr("href"));
			e.preventDefault();
		},
		triggerInsertRow: function(e){
			this.vent.trigger("insertRow", e);
			e.preventDefault();	
		}
	});
	return TableHeader;
});