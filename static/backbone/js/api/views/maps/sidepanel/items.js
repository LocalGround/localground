define(["backbone",
		"text!" + templateDir + "/sidepanel/collectionHeader.html",
		"views/maps/sidepanel/photoItem"
		],
	   function(Backbone, collectionHeader) {
	/** 
     * Class that adds a collection of data items to the
     * right-hand panel. Extends Backbone.View.
     * @class Items
     */
	localground.maps.views.Items = Backbone.View.extend({
		/**
		 * @lends localground.maps.views.Items#
		 */
		
		/** A rendered dataCollectionView template */
		template: _.template( collectionHeader ),
		
		/**
		 * A rendered template corresponding to each model
		 * within the collection.
		*/
		itemTemplateHtml: null,
		
		/** A data collection (extends Backbone.Collection) */
		collection: null,
		
		/**
		 * A list of {@link localground.maps.views.Item} views
		 * associated w/each model in the collection
		 */
		itemViews: [],
		
		/** A Google Map */
		map: null,
		
		events: {
			'click .check-all': 'checkAll'
		},
		
		/**
		 * Renders a side panel view of the particular
		 * Backbone collection that the view has been initialized
		 * with.
		 * @param {Object} opts
		 * A dictionary of options.
		 * @param {Backbone.Collection} opts.collection
		 * @param {HTML} opts.itemTemplateHtml
		 * @param {google.maps.Map} opts.map
		 */
		initialize: function(opts) {
			$.extend(this, opts);
		},
		
		/**
		 * Renders a side panel view of the particular
		 * Backbone collection that the view has been initialized
		 * with.
		 */
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
		/**
		 * Renders an individual listing based on the item
		 * @param {Backbone.Model} item
		 * A Backbone Model of the corresponding datatype
		 */
		renderItem: function(item) {
			var itemView = new localground.maps.views.PhotoItem({
				model: item,
				template: _.template( this.itemTemplateHtml ),
				map: this.map
			});
			this.itemViews.push(itemView);
			this.$el.find(".collection-data").append(itemView.render().el);
		},
		/**
		 * Selects all child data elements in the Items View, based
		 * on the status of the corresponding .check-all checkbox.
		 */
		checkAll: function(){
			var isChecked = this.$el.find('.check-all').prop("checked");
			this.$el.find('.data-item > input').prop("checked", isChecked);
			$.each(this.itemViews, function() {
				this.showMarker(isChecked);
			});
		}
	});
	return localground.maps.views.Items;
});
