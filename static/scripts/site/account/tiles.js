var self;

localground.tiles = function(){ };

localground.tiles.prototype = new localground.profile(); // Here's where the inheritance occurs 

localground.tiles.prototype.initialize=function(opts){
    localground.profile.prototype.initialize.call(this, opts);
    
    //add tagging auto-complete
    $('.tags').autocomplete(
		"/tagging_autocomplete/list/json",
		{
			multiple: true,
			width: 300,
			minChars: 1,
			matchContains: true,
			matchSubset: false,
			mustMatch: false,
			selectFirst: false
		}
	);
};

localground.tiles.prototype.addObject = function() {
    var $msg = $('<div id="load_msg">Coming soon!</div>')
                    .css({
                        'width': '520px',
                        'height': '100px',
                        'text-align': 'center'
                    });
    $('#add-modal-body').empty().append($msg);
    $('#add-modal').modal('show');
};