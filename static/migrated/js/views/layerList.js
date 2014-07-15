var LayerList = Backbone.View.extend({
	events: {
		'click btn': 'addSymbol'
	},
	render: function(opts){
		//alert("render layer list");
		this.el = $(opts.el).get(0);
		alert(this.$el.html());
		var template = _.template(opts.template);
		this.$el.html(template);
		
		//opts.$element.html(template);
	},
	addSymbol: function(){
		alert("add!");
		layerManager.createLayer(map, managers);
		$("#new_layer_panel").show();
		$("#layers").hide();
		event.preventDefault();
	}
});

/*
var initButtons = function() {
		var that = this;
		$("#add_symbol").click(function(){
			layerManager.createLayer(map, managers);
			$("#new_layer_panel").show();
			$("#layers").hide();
			return false;
		});
		
		$("#new_layer_panel").find("input").click(function(){
			layerManager.preview();
		});
		
		$("#new_layer_panel").find("input").blur(function(){
			layerManager.preview();	
		});
		
		$("#marker_cancel").click(function(){
			cancel();
			return false;
		});
		
		$("#symbol_type").change(function(){
			if($(this).val() != "-1") {
				layerManager.createLayer(map, managers);
			}
		});
		
		$("#code_symbol").click(function(){
			layerManager.showCode();
			return false;
		});
		
		$("#save_symbol").click(function(){
			save.call(that);
			return false;
		});
		
	};*/