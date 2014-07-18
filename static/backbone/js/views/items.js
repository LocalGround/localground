define(["lib/external/backbone-min", "views/item", "text!templates/collectionHeader.html"],
	   function(Backbone, ItemView, collectionHeader) {
	var ItemsView = Backbone.View.extend({
		template: _.template( collectionHeader ),
		itemTemplateHtml: null,
		collection: null,
		events: {
			'click .check-all': 'checkAll'
		},
		initialize: function(opts) {
			$.extend(this, opts);
		},
		render: function() {
			alert("Updating Collection \"" + this.collection.name + "\"");
			this.$el.empty();
			this.$el.append(this.template({name: this.collection.name}));
			this.collection.each(function(item) {
				this.renderItem(item);
			}, this);
			this.delegateEvents();
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
			//var isChecked = this.$el.find('.check-all').prop("checked");
			this.$el.find('.item > input').trigger("click");
		}
	});
	return ItemsView;
});
