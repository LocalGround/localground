// Understands how to manage and symbolize overlays according
// to a set of filter criteria.
Layer = function(opts){
	var me = this;
	if (opts.map == null || opts.rule == null) {
		alert("map and rule must be defined");
		return;
	}
	this.id = -1;
	this.map = opts.map;
	this.style = new Style();
	this.tempStyle = new Style();
	this.label = null;
	this.symbols = [];
	this.rule = opts.rule;
	this.data = this.rule.matchData();
	//alert(JSON.stringify(this.data));
	$.each(this.data, function() {
		me.symbols.push(new Symbol(me.map, this.latLng, me.style));
	});
};

Layer.prototype.revert = function() {
	this._update(this.style);
};

Layer.prototype.preview = function() {
	this.tempStyle.updateFromForm();
	this._update(this.tempStyle);
};

Layer.prototype.update = function() {
	//copy tempStyle to style
	this.style = $.extend(true, {}, this.tempStyle);
	this._update(this.style);
};
Layer.prototype._update = function(style) {
	this.label = $("#symbol_display_name").val();
	var me = this;
	$.each(this.symbols, function(){
		this.applyStyle(style);
	});
};

Layer.prototype.destroy = function(){
	$.each(this.symbols, function(){
		this.googleOverlay.setMap(null);	
	});
};

Layer.prototype.getListing = function(){
	var $listings = $("#layers").find(".form-group")
	var $layerListing = $listings.eq(this.id);
	if ($layerListing.get(0) == null) {
		$layerListing = $("<div></div>").addClass("form-group");
		$("#layers").append($layerListing);
	}
	else {
		$layerListing.empty();
	}
	return $layerListing;
}

Layer.prototype.renderListing = function(layerManager){
	var me = this;

	var $symbol = this.style.renderListing();
	var $label = $("<div></div>")
					.addClass("symbol-label")
					.html(this.label);
	var $deleteButton = $("<i></i>")
					.addClass("fa fa-trash-o pull-right")
					.css({"cursor": "pointer"})
					.click(function(){
						layerManager.removeLayer(me.id);
						return false;
					});
	var $editButton = $("<i></i>")
					.addClass("fa fa-edit pull-right")
					.css({"cursor": "pointer"})
					.click(function(){
						layerManager.setActiveLayer(me.id);
						me.edit();
						return false;
					});
	$layerListing = this.getListing();
	$layerListing
		.append($symbol)
		.append($label)
		.append($deleteButton)
		.append($editButton);
};

Layer.prototype.edit = function() {
	this.style.populateForm();
	$("#new_layer_panel").show();
	$("#layers").hide();
	$("#rule").val(this.rule);
	$("#save_symbol").html("Update");
	$("#symbol_display_name").val(this.label);
};

Layer.prototype.showCode = function(){
	return {
		style: this.style.showCode(),
		label: this.label
	};
}

