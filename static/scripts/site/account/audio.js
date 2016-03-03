var self;

localground.audio = function(){
    this.player = null;
	this.listenerFunction = 'o.player';
};

localground.audio.prototype = new localground.profile(); // Here's where the inheritance occurs 

localground.audio.prototype.initialize=function(opts){
    localground.profile.prototype.initialize.call(this, opts);
	$.extend(this, opts);
    
    /* add tagging auto-complete
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
	);*/

	$('.tags').selectize({delimiter: '%s', persist: false, create: function(input) {return {value: input,text: input}}});
    
    //include /static/scripts/lib/player.js
    this.player = new localground.player();
    this.player.initialize({
		listenerFunction: this.listenerFunction,
		flashID: 'audio_player',
		renderFlashPlayer: true
	});
};

localground.audio.prototype.addObject = function() {
    var $msg = $('<div id="load_msg">Coming soon!</div>')
                    .css({
                        'width': '520px',
                        'height': '100px',
                        'text-align': 'center'
                    });
    $('#add-modal-body').empty().append($msg);
    $('#add-modal').modal('show');
};