/**
 * For convenience, this class depends on the global variable "self" which
 * is the main controller object that uses this class.
**/
localground.audio = function(opts){
    this.path = null;
    this.file_name_orig = null;
    this.description = null;
    $.extend(this, opts);
    this.overlayType = 'audio';
    this.iframeURL = '/scans/update-' + this.overlayType + '/embed/?id=' + this.id;
    //initialize icons in the constructor:
    this.image = this.iconSmall = this.iconLarge = '/static/images/sound.png';
};

localground.audio.prototype = new localground.point();

localground.audio.prototype.showInfoBubbleView = function(opts) {
    if(self == null) {
        alert('The variable self should be set to the map controller in the \
                parent class');
        return;
    }
    //ensures that the marker renders on top:
    this.googleOverlay.setMap(null);
    this.googleOverlay.setMap(self.map);

    //build bubble content:
    var chars = 0
    var $c = $('<div />');
    if(this.name) {
        $c.append($('<h4></h4>')
                    .css({'line-height': '22px', 'margin-bottom': '5px'})
                    .html(this.name));
        chars += this.name.length;
    }
    var me = this;
    $c.append(
        $('<div />')
            .css({'text-align': 'center', 'margin-right': '5px'})
            .addClass('inset-block')
            .append($('<a class="play_link" href="#">play</a>')
            .click(function() {
                $('#player').show();
                $('#audio_url').val(me.path);
                if($(this).html() == 'play') {
                    $('.play').triggerHandler('click');
                    $(this).html('pause')
                }
                else {
                    $('.pause').triggerHandler('click');
                    $(this).html('play')
                }
                return false;
            }))
            .append(' | ')
            .append($('<a class="stop_link" href="#">stop</a>')
            .click(function() {
                $('#audio_url').val(me.path);
                $('.stop').triggerHandler('click');
                $(this).parent().find('.play_link').html('play');
                return false;
            })));
    //add name, description, and tags
    if(this.description) {
        $c.append($('<p></p>').html(this.description));
        chars += this.description.length;
    }
    if(this.tags & this.tags.length > 2) {
        $c.append($('<p></p>').html('tags: ' + this.tags));
        chars += this.description.length;
    }
    htmlString = $c;
    var extra = chars/50.0*22;
    //set width & height:
    var $contentContainer = $('<div></div>').css({
            'width': '250px',
            'height': (85+extra) + 'px',
            'margin': '5px 0px 5px 10px',
            'overflow-y': 'auto',
            'overflow-x': 'hidden'
        }).append(htmlString);
    var showHeader = false;
    self.infoBubble.setHeaderText(showHeader ? this.name.truncate(5) : null);
    self.infoBubble.setFooter(null);    
    self.infoBubble.setContent($contentContainer.get(0)); 
    self.infoBubble.open(self.map, this.googleOverlay);
};

