localground.ebays = function(){
	this.tableManager = null;
    this.dataTables = [];	
};

localground.ebays.prototype = new localground.editor();

localground.ebays.prototype.initialize=function(opts){
    localground.editor.prototype.initialize.call(this, opts);
	this.initCustomLayout();
    this.getAirQualityData();
};

// "extend" function is defined in namespace.js; basically, this
// code is appending the functions in the "localground.ebaysMixins"
// class to the "localground.editor" class.
extend(localground.ebays.prototype, localground.ebaysMixins.prototype);