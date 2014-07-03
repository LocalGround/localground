localground.LayerManager = (function () {
	var activeLayer = null;
	var layers = [];
	
	this.showCode = function(index) {
		var l = [];
		$.each(layers, function(){
			l.push(this.showCode());
		});
		alert(JSON.stringify(l));
		return l;
	};
	
	this.createLayer = function(map, managers){
		activeLayer = new Layer({
			map: map,
			rule: new Rule($("rule").val(), managers)
		});
	};
	
	this.removeLayer = function(index) {
		var layer = layers[index];
		layer.getListing().remove();
		//if (activeLayer.id == index)
		//	activeLayer = null;
		layer.destroy();
		layers.splice(index, 1);
		
		// reassign layer ids so that they correspond with the
		// order of the layers. Prob. ought to make the layers
		// object into a dictionary, as this is a bit hacky.
		$.each(layers, function(index){
			this.id = index;
		});
		if (this.size() == 0)
			$("#layers > span").show();
	};
	
	this.preview = function(){
		activeLayer.preview();
	};
	
	this.cancelAdd = function(){
		if(activeLayer.id == -1)
			activeLayer.destroy();
		else
			activeLayer.revert();
		activeLayer = null;
		return false;
	};
	
	this.addLayer = function(){
		//only append layer to list if it's a new layer:
		activeLayer.update();
		if(activeLayer.id == -1) {
			activeLayer.id = this.size();
			layers.push(activeLayer);
		}
		$("#new_layer_panel").hide();
		$("#layers > span").hide();
		$("#layers > div").show();
		$("#save_symbol").html("Add");
		$("#layers").show();
		activeLayer.renderListing(this);
	};

	this.setActiveLayer = function(index) {
		activeLayer = layers[index];
	};
	
	this.size = function() {
		return layers.length;
	};
	
	this.get = function(index) {
		return layers[index];
	};

});

