define(["backbone",
		"text!" + templateDir + "/sidepanel/collectionHeader.html",
		"views/maps/sidepanel/item",
		"config"
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
		
		visibleItems: null,
		
		/** A data collection (extends Backbone.Collection) */
		collection: null,
		
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
		 */
		initialize: function(sb, opts) {
			this.sb = sb;
			$.extend(this, opts);
			
			this.visibleItems = {};
			this.restoreState();
			this.collection.on('add', this.renderItem, this);
		},
		
		/**
		 * Renders a side panel view of the particular
		 * Backbone collection that the view has been initialized
		 * with.
		 */
		render: function(opts) {
			opts = opts || {};
			this.$el.append(this.template({
				name: this.collection.name,
				isVisible: opts.isVisible,
				isExpanded: opts.isExpanded
			}));
			if (this.collection.length == 0) { this.$el.hide(); }
			return this;
		},
		/**
		 * Renders an individual listing based on the item
		 * @param {Backbone.Model} item
		 * A Backbone Model of the corresponding datatype
		 */
		renderItem: function(item, isVisible) {
			this.$el.show();
			var view = new localground.maps.views.Item(sb, {
				model: item,
				template: _.template( this.getItemTemplate() ),
			});
			this.$el
				.find(".collection-data")
				.append(view.render({isVisible: true}).el);
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
				this.eventManager.trigger(localground.events.EventTypes.EXPAND);
				$symbol.removeClass('fa-caret-right').addClass('fa-caret-down');
				$panel.show("slow");
			}
			else {
				this.isExpanded = false;
				this.eventManager.trigger(localground.events.EventTypes.CONTRACT);
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
		
		getItemTemplate: function(){
			var configKey = this.collection.key.split("_")[0];
			return localground.config.Config[configKey].ItemTemplate;	
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
