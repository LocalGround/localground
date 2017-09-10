localground.createmixin = function(opts){};

localground.createmixin.prototype.createNew = function(googleOverlay, projectID) {
    var me = this;
    $.ajax({
        url: '/api/0/markers/?format=json',
        type: 'POST',
        data: {
            geometry: JSON.stringify(me.getGeoJSON(googleOverlay)),
            project_id: projectID,
            color: me.color,
            format: 'json'
        },
        success: function(data) {
	    data.managerID = 'markers';
            $.extend(me, data);
            //add to marker manager:
            me.getManager().addNewOverlay(me);
            //remove temporary marker:
            googleOverlay.setMap(null);
        },
        notmodified: function(data) { alert('Not modified'); },
        error: function(data) { alert('Error'); }
    }); 
};


