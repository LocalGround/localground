localground.table = function(table, color){
    this.id = table.form.id;
    this.name = table.form.name;
    this.color = color;
    this.data = [];
    if(table != null && table.data)
        this.addRecords(table.data);
    //this.addDataContainer();
};

localground.table.prototype = new localground.manager();

localground.table.prototype.getObjectType = function() {
    return 'table_' + this.id;
};
localground.table.prototype.addRecords = function(data) {
    var me = this;
    $.each(data, function(){
        me.data.push(new localground.note(this, me.color, me.id));        
    });
};

localground.table.prototype.makeEditable = function() {
	$.each(this.data, function() {
        this.makeEditable();	
    });
};

localground.table.prototype.makeViewable = function() {
	$.each(this.data, function() {
        this.makeViewable();	
    });
};

/*****************
 NOTES MANAGER
******************/
localground.noteManager = function(){
    this.colors = ['1F78B4', 'B2DF8A', '33A02C', 'FB9A99', 'E31A1C', 'FDBF6F',
                    'A6CEE3'];
    this.tables = {}; //a dictionary of table ids and table objects
    this.overlayType = 'note';
};

localground.noteManager.prototype.numTables = function() {
    var num = 0, key;
    for(key in this.tables) {
        if(this.tables.hasOwnProperty(key)) num++;
    }
    return num;
};

localground.noteManager.prototype.nextColor = function() {
    return this.colors[this.numTables()]; 
};

localground.noteManager.prototype.removeByProjectID = function(projectID) {
    for(key in this.tables) {
        this.tables[key].removeByProjectID(projectID);
    }
};

localground.noteManager.prototype.addRecords = function(tableData) {
    var formID = tableData.form.id;
    if(this.tables[formID] == null)
        this.tables[formID] = new localground.table(tableData, this.nextColor());
    else
        this.tables[formID].addRecords(tableData.data);
};

localground.noteManager.prototype.toggleOverlays = function(isOn) {
    //iterate through each table and turn on/off:
    $.each(this.tables, function() {
        this.toggleOverlays(isOn);
    });
};

localground.noteManager.prototype.zoomToLayer = function(opts) {
    if(opts != null && opts.tableID != null) {
        //if a specific layer is requested, zoom to it:
        this.tables[opts.tableID].zoomToLayer();
    }
    else {
        var bounds = this.getLayerBounds();
        if(bounds != new google.maps.LatLngBounds())
            self.map.fitBounds(bounds);
    }
};

localground.noteManager.prototype.zoomToLayers = function(opts) {
    this.zoomToLayer();
};

localground.noteManager.prototype.getLayerBounds = function() {
    if(this.tables.length == 0)
        return null;
    var boundsAll = null;
    //otherwise, zoom to the extent of everything:
    for(key in this.tables) {
        var bounds = this.tables[key].getLayerBounds();
        if(boundsAll == null)
            boundsAll = bounds;   
        else if(bounds != null)
            boundsAll.union(bounds);
    }
    return boundsAll;
};

localground.noteManager.prototype.renderOverlays = function() {
    //in the notes section, there may be more than one table.  This inner loop
    //renders data for each of the tables:
    $.each(this.tables, function() {
        this.renderOverlays();
    });
};

localground.noteManager.prototype.makeEditable = function() {
	$.each(this.tables, function(key, val) {
        this.makeEditable();	
    });
};

localground.noteManager.prototype.makeViewable = function() {
	$.each(this.tables, function(key, val) {
        this.makeViewable();
    });
};

