define(
	[
		'backbone',
		'infobubble',
		'config',
		'slick'
		
	], function(Backbone, InfoBubble, Config) {
	/**
	 * Manages InfoBubble Rendering
	 * @class InfoBubble
	 */
	localground.maps.views.BubbleManager = Backbone.View.extend({
		/**
		 * @lends localground.maps.views.InfoBubble#
		 */
		
		/** A google.maps.Map object */
		map: null,
		
		/** A hook to global application events */
		bubble: null,
		tip: null,
		bubbleModel: null,
		tipModel: null,
		
		/**
		 * Initializes
		 */
		initialize: function(sb) {
			this.sb = sb;
			this.map = sb.getMap();
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
			
			
			sb.listen({ 
                "show-bubble"  : this.showBubble, 
                "hide-bubble"  : this.hideBubble, 
                "show-tip" : this.showTip, 
                "hide-tip" : this.hideTip
            }); 
		},
		
		/**
		 * Jams template inside infoBubble
		 */
		render: function(opts) {
			//$(this.el).html(this.template(opts));
		},
		
		showBubble: function(data){
			var model = this.bubbleModel = data.model;
			var latLng = data.center;
			var that = this;
			this.tip.close();
			this.bubble.modelID = model.id;
			model.fetch({
				/*
					Todo: refactor so there are 2 bubble views:
						- a default one, and
						- one for markers
				*/
				success: function(){
					var template = that.getTemplate(model, "InfoBubbleTemplate");
					if (latLng == null) { latLng = model.getCenter(); }
					that.$el.html(template(that.getContext(model)));
					that.bubble.setContent(that.$el.html());
					console.log(that.$el.find('.single-item'));
					that.bubble.setPosition(latLng);
					that.bubble.open();
					
					window.setTimeout(function() {
						$('.marker-container').slick({
							dots: false	
						});	
					}, 200);
				}	
			});
		},
		hideBubble: function(data){
			if (this.bubbleModel == data.model)
				this.bubble.close();	
		},
		showTip: function(data){
			var model = data.model, latLng = data.center;
			if(this.bubble.modelID == model.id &&
				this.bubble.isOpen()) { return; }
			var template = this.getTemplate(model, "TipTemplate");
			if (latLng == null) { latLng = model.getCenter(); }
			this.tip.setContent(template(this.getContext(model)));
			this.tip.setPosition(latLng);
			this.tip.open();	
		},
		hideTip: function(){
			this.tip.close();	
		},
		getTemplate: function(model, templateKey) {
			var configKey = model.getKey().split("_")[0];
			var Template = localground.config.Config[configKey][templateKey]
			return _.template(Template);
		},
		getContext: function(model){
			var opts = model.toJSON();
			if (model.getDescriptiveText)
				opts.descriptiveText = model.getDescriptiveText();
			return opts;
		},
		destroy: function(){
			alert("bye");	
		}
	});
	return localground.maps.views.BubbleManager;
});
