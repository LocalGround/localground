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
		initialize: function(sb, opts) {
			$.extend(this, opts);
			this.eventManager = sb.eventManager;
			this.bubble = new InfoBubble({
				borderRadius: 5,
				maxHeight: 385,
				padding: 0,
				disableAnimation: true,
				map: this.map
			});
			
			/*sb.listen({ 
                "show-bubble"  : this.change_filter, 
                "show-tip" : this.reset, 
                "hide-tip" : this.search
            });*/ 
			
			this.tip = new InfoBubble({
				borderRadius: 5,
				maxHeight: 385,
				padding: 0,
				disableAnimation: true,
				disableAutoPan: true,
				hideCloseButton: true,
				map: this.map
			});
			
			this.addEventHandlers(sb);
		},
		
		/**
		 * Jams template inside infoBubble
		 */
		render: function(opts) {
			//$(this.el).html(this.template(opts));
		},
		
		showBubble: function(model, latLng){
			var that = this;
			
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
		showTip: function(model, latLng) {
			var template = this.getTemplate(model, "TipTemplate");
			if (latLng == null) { latLng = model.getCenter(); }
			this.tip.setContent(template(this.getContext(model)));
			this.tip.setPosition(latLng);
			this.tip.open();	
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
		addEventHandlers: function(sb){
			var that = this;			
			this.eventManager.on("show_bubble", function(model, latLng){
				that.tip.close();
				that.bubble.modelID = model.id;
				that.showBubble(model, latLng);
			});
			
			this.eventManager.on("show_tip", function(model, latLng){
				//don't show tip if the bubble's already open:
				console.log('show tip');
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
