define(["lib/external/backbone-min", "views/item", "text!templates/collectionHeader.html"],
	   function(Backbone, ItemView, collectionHeader) {
	var ItemsView = Backbone.View.extend({
		template: _.template( collectionHeader ),
		events: {
			'click .check-all': 'checkAll'
		},
		initialize: function(opts) {
			this.collection = opts.collection;
			this.itemTemplateHtml = opts.itemTemplateHtml;
			this.render();
			this.collection.on("reset", this.render, this);
		},
		render: function() {
			this.$el.empty();
			this.$el.append(this.template({name: this.collection.name}));
			this.collection.each(function(item) {
				this.renderItem(item);
			}, this);
			return this;
		},
		renderItem: function(item) {
			var itemView = new ItemView({
				model: item,
				template: _.template( this.itemTemplateHtml ),
			});
			this.$el.find(".collection-data").append(itemView.render().el);
		},
		checkAll: function(){
			var isChecked = this.$el.find('.check-all').prop("checked");
			this.$el.find('input').prop("checked", isChecked);
		}
	});
	return ItemsView;
});
