localground.ebays = function(){
	this.tableManager = null;
    this.dataTables = [];	
};

localground.ebays.prototype = new localground.viewer();

localground.ebays.prototype.initialize=function(opts){
    localground.viewer.prototype.initialize.call(this, opts);
	this.initCustomLayout();
	this.updateChartPanelLayout();
    this.getAirQualityData({isOpen: true});
};

// "extend" function is defined in namespace.js; basically, this
// code is appending the functions in the "localground.ebaysMixins"
// class to the "localground.viewer" class.
extend(localground.ebays.prototype, localground.ebaysMixins.prototype);

