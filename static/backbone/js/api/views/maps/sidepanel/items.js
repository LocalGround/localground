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
		
		sb: null,
		
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
			this.setElement(opts.el);
			this.render();
			this.collection.on('add', this.renderItem, this);
			this.collection.on('remove', this.hideIfEmpty, this);
		},
		
		/**
		 * Renders a side panel view of the particular
		 * Backbone collection that the view has been initialized
		 * with.
		 */
		render: function() {
			var opts = this.restoreState();
			$.extend(opts, {
				name: this.collection.name,
				key: this.collection.key
			});
			this.$el.append(this.template(opts));
			if (this.collection.length == 0) { this.$el.hide(); }
			return this;
		},
		/**
		 * Renders an individual listing based on the item
		 * @param {Backbone.Model} item
		 * A Backbone Model of the corresponding datatype
		 */
		renderItem: function(item) {
			this.$el.show();
			var $container = $("<div></div>");
			this.$el.find(".collection-data").append($container);
			this.sb.loadSubmodule(
				"item-" + item.getKey() + "-" + item.id, localground.maps.views.Item,
				{
					model: item,
					template: _.template( this.getItemTemplate() ),
					el: $container
				}
			);
		},
		/**
		 * Selects all child data elements in the Items View, based
		 * on the status of the corresponding .check-all checkbox.
		 */
		checkAll: function(e){
			var $cb = $(e.currentTarget);
			var isChecked = $cb.prop("checked");
			if (isChecked) {
				this.collection.each(function(model){
					model.trigger("show-item");
				});
				// Expand panel if user turns on the checkbox.
				// Not sure if this is a good UI decision.
				if (!this.isExpanded()) 
					this.showHide();
			}
			else {
				this.collection.each(function(model){
					model.trigger("hide-item");
				});	
			}
			this.saveState();
		},
		/**
		 * Zooms to the extent of the child data elements of the corresponding
		 * data type.
		 */
		zoomToExtent: function(e){
			this.collection.trigger("zoom-to-extent");
		},
		
		isExpanded: function(){
			return !this.$el.find('.show-hide').hasClass('fa-caret-right');
		},
		isVisible: function(){
			return this.$el.find('input').attr('checked') == "checked";
		},
		triggerShowHide: function(e){
			this.showHide();
			e.preventDefault();
		},
		/**
		 * Zooms to the extent of the child data elements of the corresponding
		 * data type.
		 */
		showHide: function(){
			$symbol = this.$el.find(".show-hide");
			var $panel = this.$el.find(".collection-data");
			if (this.isExpanded()) {
				this.sb.notify({ type : "contract" });
				$symbol.removeClass('fa-caret-down').addClass('fa-caret-right');
				$panel.hide("slow");
			}
			else {
				this.sb.notify({ type : "expand" });
				$symbol.removeClass('fa-caret-right').addClass('fa-caret-down');
				$panel.show("slow");
			}
			this.saveState();
		},
		
		getItemTemplate: function(){
			var configKey = this.collection.key.split("_")[0];
			return localground.config.Config[configKey].ItemTemplate;	
		},
		
		saveState: function(){
			this.sb.saveState({
				isExpanded: this.isExpanded(),
				isVisible: this.isVisible()
			});
		},
		
		restoreState: function(){
			var state = this.sb.restoreState();
			if (state == null)
				return { isExpanded: false, isVisible: false };
			else
				return state;
		},
		
		hideIfEmpty: function(){
			if (this.collection.length == 0)
				this.$el.hide();
		},
		
		destroy: function(){
			this.remove();
		}
	});
	return localground.maps.views.Items;
});
