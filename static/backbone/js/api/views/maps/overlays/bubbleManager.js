define(
	[
		'backbone',
		'infobubble',
		'config',
		'form',
		"bootstrap-form-templates",
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
		
		events: {
            "click .btn-primary": "saveForm"
		},
		
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
                "hide-tip" : this.hideTip,
				"mode-change": this.refresh
            }); 
		},
		
		/**
		 * Jams template inside infoBubble
		 */
		render: function(opts) {
			//$(this.el).html(this.template(opts));
		},
		
		showBubble: function(data){
			this.bubble.close();
			var that = this;
			var model = this.bubbleModel = data.model;
			var latLng = data.center;
			this.tip.close();
			this.bubble.model = model;
			model.fetch({ success: function(){
				that.renderBubble(model, latLng);	
			}});
		},
		refresh: function(){
			if(this.bubble.isOpen()) { 
				this.showBubble({
					model: this.bubble.model,
					latLng: this.bubble.position
				});
			}
		},
		renderBubble: function(model, latLng){
			if (this.sb.getMode() == "view") {
				this.renderViewContent(model, latLng);
			}
			else {
				this.renderEditContent(model, latLng);
			}
		},
		renderViewContent: function(model, latLng) {
			var template = this.getTemplate(model, "InfoBubbleTemplate");
			this.$el = $(template(this.getContext(model)));
			
			this.showUpdatedContent(latLng);

			//only relevant for marker in view mode:
			window.setTimeout(function() {
				$('.marker-container').slick({
					dots: false	
				});	
			}, 200);
		},
		
		renderEditContent: function(model, latLng){
			var that = this;
			model.fetchSchemas();
			model.on("schemaLoaded", function(){
				var template = that.getTemplate(model, "InfoBubbleTemplate");
				that.setElement($(template({mode: "edit"})));
				var ModelForm = Backbone.Form.extend({
					schema: model.updateSchema
				});

				that.form = new ModelForm({
					model: model
				}).render();
				that.$el.find('.form').append(that.form.$el);
				that.showUpdatedContent(latLng);
			});
		},
		saveForm: function(e){
			console.log("save form");
			this.form.commit();	//does validation
			this.bubble.model.save(); //does database commit
			e.preventDefault();
		},
		showUpdatedContent: function(latLng){
			this.bubble.setContent(this.$el.get(0));
			this.bubble.setPosition(latLng);
			this.bubble.open();	
		},
		hideBubble: function(data){
			if (this.bubbleModel == data.model)
				this.bubble.close();	
		},
		showTip: function(data){
			if (this.sb.getMode() == "edit") { return; }
			var model = data.model, latLng = data.center;
			if(this.bubble.model && this.bubble.model.id == model.id &&
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
			opts.mode = this.sb.getMode();
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
