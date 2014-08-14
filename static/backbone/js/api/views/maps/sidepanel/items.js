define(["backbone",
		"views/maps/sidepanel/item",
		"views/maps/sidepanel/photoItem",
		"text!" + templateDir + "/sidepanel/collectionHeader.html"],
	   function(Backbone, ItemView, PhotoItemView, collectionHeader) {
	var ItemsView = Backbone.View.extend({
		template: _.template( collectionHeader ),
		itemTemplateHtml: null,
		collection: null,
		map: null,
		events: {
			'click .check-all': 'checkAll'
		},
		initialize: function(opts) {
			$.extend(this, opts);
		},
		render: function() {
			this.$el.empty();
			if (this.collection.length == 0) {
				return this;
			}
			this.$el.append(this.template({name: this.collection.name}));
			this.collection.each(function(item) {
				this.renderItem(item);
			}, this);
			this.delegateEvents();
			return this;
		},
		renderItem: function(item) {
			var itemView = new PhotoItemView({
				model: item,
				template: _.template( this.itemTemplateHtml ),
				map: this.map
			});
			this.$el.find(".collection-data").append(itemView.render().el);
		},
		checkAll: function(){
			var isChecked = this.$el.find('.check-all').prop("checked");
			this.$el.find('.data-item > input').prop("checked", !isChecked);
			this.collection.each(function(item) {
				this.addMarker(isChecked);
			}, this);
			//this.$el.find('.data-item > input').trigger("click");
		}
	});
	return ItemsView;
});
