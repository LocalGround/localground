define(
	[
		'backbone',
		'infobubble',
		'config'
		
	], function(Backbone, InfoBubble, Config) {
	/**
	 * Manages InfoBubble Rendering
	 * @class InfoBubble
	 */
	localground.maps.views.InfoBubble = Backbone.View.extend({
		/**
		 * @lends localground.maps.views.InfoBubble#
		 */
		
		/** A google.maps.Map object */
		map: null,
		
		/** A hook to global application events */
		eventManager: null,
		bubble: null,
		tip: null,
		
		/**
		 * Initializes
		 */
		initialize: function(opts) {
			$.extend(this, opts);
			this.bubble = new InfoBubble({
				borderRadius: 5,
				maxHeight: 385,
				padding: 0,
				disableAnimation: true,
				map: this.map
			});
			
			this.tip = new InfoBubble({
				borderRadius: 5,
				maxHeight: 385,
				padding: 0,
				disableAnimation: true,
				disableAutoPan: true,
				hideCloseButton: true,
				map: this.map
			});
			
			this.addEventHandlers();
		},
		
		/**
		 * Jams template inside infoBubble
		 */
		render: function(model) {
			console.log("render InfoBubble!!!");
		},
		
		showBubble: function(model, latLng){
			var configKey = model.getKey().split("_")[0];
			var BubbleTemplate = localground.config.Config[configKey].InfoBubbleTemplate;
			var template = _.template(BubbleTemplate);
			this.bubble.setContent(template(model.toJSON()));
			this.bubble.setPosition(latLng);
			this.bubble.open();
		},
		showTip: function(model, latLng) {
			var configKey = model.getKey().split("_")[0];
			var TipTemplate = localground.config.Config[configKey].TipTemplate;
			var template = _.template(TipTemplate);
			if (latLng == null) { latLng = model.getCenter(); }
			this.tip.setContent(template(model.toJSON()));
			this.tip.setPosition(latLng);
			this.tip.open();	
		},
		addEventHandlers: function(){
			var that = this;			
			this.eventManager.on("show_bubble", function(model, latLng){
				that.tip.close();
				that.bubble.modelID = model.id;
				that.showBubble(model, latLng);
			});
			
			this.eventManager.on("show_tip", function(model, latLng){
				//don't show tip if the bubble's already open:
				if(that.bubble.modelID == model.id &&
						that.bubble.isOpen()) { return; }
				that.showTip(model, latLng);
			});
			
			this.eventManager.on("hide_tip", function(){
				that.tip.close();
			});
		}
	});
	return localground.maps.views.InfoBubble;
});
