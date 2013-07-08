/**
 * For convenience, this class depends on the global variable "self" which
 * is the main controller object that uses this class.
**/
localground.audio = function(opts){
    this.path = null;
    this.file_name_orig = null;
    this.description = null;
    $.extend(this, opts);
    this.managerID = this.overlay_type = self.overlay_types.AUDIO;
    this.iframeURL = '/scans/update-' + this.overlay_type + '/embed/?id=' + this.id;
    //initialize icons in the constructor:
    this.image = this.iconSmall = this.iconLarge = '/static/images/headphones_small.png';
    this.bubbleWidth = 250;
    this.bubbleHeight = 200;
};

localground.audio.prototype = new localground.point();

localground.audio.prototype.renderPlayerLinks = function(opts) {
    var me = this;
    return $('<div />')
        .css({
            'text-align': 'center',
            'padding-top': '8px',
            'height': '30px',
            'background-color': '#eee'
        })
        .append($('<a class="play_link" href="#">play</a>')
                .click(function() {
                    $('#player').show();
                    $('#audio_url').val(me.file_path);
                    if($(this).html() == 'play') {
                        $('#player').find('.play').triggerHandler('click');
                        $(this).html('pause')
                    }
                    else {
                        $('#player').find('.pause').triggerHandler('click');
                        $(this).html('play')
                    }
                    return false;
                })
        )
        .append(' | ')
        .append($('<a class="stop_link" href="#">stop</a>')
            .click(function() {
                $('#audio_url').val(me.file_path);
                $('#player').find('.stop').triggerHandler('click');
                $(this).parent().find('.play_link').html('play');
                return false;
            })
        );  
};

localground.audio.prototype.showInfoBubbleView = function(opts) {
    var $container = $('<div />');
    $container.append(this.renderPlayerLinks());
    $container.append(this.renderDetail());

    var $contentContainer = this.renderInfoBubble();
	$contentContainer.append($container);
};

localground.audio.prototype.showInfoBubbleEdit = function(opts){
    var $contentContainer = this.renderInfoBubble({
								height: this.bubbleHeight + 100,
                                width: this.bubbleWidth + 100
							});
	var me = this;
    var fields = this.getManager().getUpdateSchema();
    var form = new ui.form({
        schema: fields,
        object: this,
        exclude: ['point', 'project_id']
    });
	var $container = $('<div />');
	$container.append(this.renderPlayerLinks())
	$container.append(form.render());
	$contentContainer.append($container);
};

localground.audio.prototype.mouseoverF = function(){
	var $innerObj = $('<div />')
						.append($('<img />')
							.attr('src', this.image)
							.css({float: 'left', 'margin-right': '5px'}))
						.append($('<p />').html(this.name)
                                .css({'padding-top': '10px'}));
	this.showTip({
        height: '40px',
        overflowY: 'hidden',
		contentContainer: $innerObj 
	});
};

