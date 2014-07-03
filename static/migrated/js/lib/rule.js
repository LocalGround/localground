Rule = function(ruleText, managers){
	this.ruleText = ruleText;
	this.managers = managers;
	this.overlayTypes = [];
	this.filters = []
	this.validate();
};

Rule.prototype.matchData = function(){
	var overlays = [];
	var overlay = null;
	var me = this;
	$.each(this.overlayTypes, function(){
		$.each(me.managers[this].records, function(){
			overlay = this;
			$.each(me.filters, function(){
				if (overlay[this.fieldName] == this.fieldValue) {
					overlays.push($.extend(true, {}, overlay));
				}
			});
		});
	});
	return overlays
};

Rule.prototype.validate = function(){
	this.overlayTypes = ["photo", "audio"];
	this.filters.push({
		fieldName: "tags",
		fieldValue: "b"
	});
};