localground.tableManager = function(table, color){
    this.id = table.form.id;
    this.name = table.form.name;
    this.color = color;
    this.data = [];
	this.overlayType = self.overlayTypes.RECORD;
    if(table != null && table.data)
        this.addRecords(table.data);
    //this.addDataContainer();
};

localground.tableManager.prototype = new localground.manager();

localground.tableManager.prototype.getObjectType = function() {
    return 'table_' + this.id;
};
localground.tableManager.prototype.addRecords = function(data) {
    var me = this;
    $.each(data, function(){
        me.data.push(new localground.record(this, me.color, me.id));        
    });
};

localground.tableManager.prototype.makeEditable = function() {
	$.each(this.data, function() {
        this.makeEditable();	
    });
};

localground.tableManager.prototype.makeViewable = function() {
	$.each(this.data, function() {
        this.makeViewable();	
    });
};


