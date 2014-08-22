define(["backbone",
		"text!" + templateDir + "/sidepanel/collectionHeader.html",
		"views/maps/sidepanel/item"
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
		
		eventManager: null,
		/**
		 * A rendered template corresponding to each model
		 * within the collection.
		*/
		ItemTemplate: null,
		
		/** */
		isVisible: false,
		
		/** */
		isExpanded: false,
		
		visibleItems: null,
		
		/**
		 * A dictionary of {@link localground.maps.views.Item} views
		 * associated w/each model in the collection
		 */
		itemViews: null,
		
		/**
		 * View class that controls the individual item listing.
		 */
		ItemView: null,
		
		/** A data collection (extends Backbone.Collection) */
		collection: null,
		
		/** A Google Map */
		map: null,
		
		events: {
			'click .check-all': 'checkAll',
			'click .zoom-to-extent': 'zoomToExtent',
			'click .show-hide': 'triggerShowHide'
		},
		
		/**
		 * Renders a side panel view of the particular
		 * Backbone collection that the view has been initialized
		 * with.
		 * @param {Object} opts
		 * A dictionary of options.
		 * @param {Backbone.Collection} opts.collection
		 * @param {HTML} opts.itemTemplate
		 * @param {google.maps.Map} opts.map
		 */
		initialize: function(opts) {
			$.extend(this, opts);
			this.itemViews = {};
			this.visibleItems = {};
			this.restoreState();
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
			this.$el.append(this.template({
				name: this.collection.name,
				isVisible: this.isVisible,
				isExpanded: this.isExpanded
			}));
			this.collection.each(function(item) {
				this.renderItem(item, this.isVisible);
			}, this);
			this.delegateEvents();
			return this;
		},
		/**
		 * Renders an individual listing based on the item
		 * @param {Backbone.Model} item
		 * A Backbone Model of the corresponding datatype
		 */
		renderItem: function(item, isVisible) {
			if (this.itemViews[item.id] == null) {
				this.itemViews[item.id] = new localground.maps.views.Item({
					model: item,
					template: _.template( this.ItemTemplate ),
					map: this.map,
					eventManager: this.eventManager,
					isVisible: this.visibleItems[item.id] || false
				});
			}
			else {
				this.itemViews[item.id].delegateEvents();
			}
			this.$el
				.find(".collection-data")
				.append(this.itemViews[item.id].render().el);
		},
		/**
		 * Selects all child data elements in the Items View, based
		 * on the status of the corresponding .check-all checkbox.
		 */
		checkAll: function(e){
			var $cb = $(e.currentTarget);
			var isChecked = $cb.prop("checked");
			
			//handle child element state:
			this.$el.find('.data-item > input').prop("checked", isChecked);
			for (key in this.itemViews) {
				this.itemViews[key].isVisible = isChecked;
			}
			
			//expand panel if checked and hidden:
			if (isChecked) {
				this.isVisible = true;
				this.eventManager.trigger(localground.events.EventTypes.SHOW_ALL, $cb.val());
				
				// Expand panel if user turns on the checkbox.
				// Not sure if this is a good UI decision.
				var $symbol = $cb.parent().find('.show-hide');
				if ($symbol.hasClass('fa-caret-right')) 
					this.showHide($symbol);
			}
			else {
				this.eventManager.trigger(localground.events.EventTypes.HIDE_ALL, $cb.val());
			}
		},
		/**
		 * Zooms to the extent of the child data elements of the corresponding
		 * data type.
		 */
		zoomToExtent: function(e){
			var $cb = $(e.currentTarget).parent().find('input');
			this.eventManager.trigger(localground.events.EventTypes.ZOOM_TO_EXTENT, $cb.val());
		},
		
		triggerShowHide: function(e){
			this.showHide($(e.currentTarget));
			e.preventDefault();
		},
		/**
		 * Zooms to the extent of the child data elements of the corresponding
		 * data type.
		 */
		showHide: function($symbol){
			var $panel = $symbol.parent().next();
			var key =  $symbol.parent().find('input').val();
			var show = $symbol.hasClass('fa-caret-right');
			if (show) {
				this.isExpanded = true;
				$symbol.removeClass('fa-caret-right').addClass('fa-caret-down');
				$panel.show("slow");
			}
			else {
				this.isExpanded = false;
				$symbol.removeClass('fa-caret-down').addClass('fa-caret-right');
				$panel.hide("slow");
			}
		},
		
		/** Helper function for the workspace serializer */
		getVisibleItemList: function(){
			var visList = [];
			for(key in this.itemViews) {
				if (this.itemViews[key].isVisible)
					visList.push(key);
			}
			return visList;
		},
		
		restoreState: function(){
			try { var workspace = JSON.parse(localStorage["workspace"]); }
			catch(e) { return; }
			var state = workspace.elements[this.collection.key];
			if (state == null) { return; }
			this.isVisible = state.isVisible;
			this.isExpanded = state.isExpanded;
			var that = this;
			$.each(state.visibleItems, function(){
				that.visibleItems[this] = true;	
			});
		}
	});
	return localground.maps.views.Items;
});
