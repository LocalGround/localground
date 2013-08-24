/**
 * For convenience, this class depends on the global variable "self" which
 * is the main controller object that uses this class.
**/
localground.marker = function(opts){
    this.review_count = 0;
    this.photo_count = 0;
    this.audio_count = 0;
    this.video_count = 0;
    this.record_count = 0;
    this.photoIDs = null;
    this.audioIDs = null;
    this.recordIDs = null;
    this.color = 'CCCCCC'
    this.accessKey = null;
    this.managerID = null;
    if(opts)
        $.extend(this, opts);
	this.image = this.markerImage = this.iconSmall = this.iconLarge =
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=0.5|0|' +
        this.color + '|13|b|';
    this.bubbleWidth = 480;
    this.bubbleHeight = 360;
};

localground.marker.prototype = new localground.point();

localground.marker.prototype.renderListingText = function() {
    var $div_text = localground.overlay.prototype.renderListingText.call(this);
    
    //append some extra information to the listing:
    var messages = [];
    if(this.getPhotoCount() > 0)
        messages.push(this.getPhotoCount() + ' photo(s)');
    if(this.getAudioCount() > 0)
        messages.push(this.getAudioCount() + ' audio clip(s)');
    if(this.getVideoCount() > 0)
        messages.push(this.getVideoCount() + ' video clip(s)');
    if(this.getRecordCount() > 0)
        messages.push(this.getRecordCount() + ' data records(s)');
    $div_text.append('<br><span>' + messages.join(', ') + '</span>');
    return $div_text;
};

localground.marker.prototype.getRecordCount = function() {
    if(this.tables) {
        var cnt = 0;
        $.each(this.tables, function(idx) {
            cnt += this.data.length;
        });
    }
    return cnt;
};

localground.marker.prototype.getPhotoCount = function() {
    if(this.photoIDs)
        return this.photoIDs.length;
    else
        return this.photo_count;
};

localground.marker.prototype.getAudioCount = function() {
    if(this.audioIDs)
        return this.audioIDs.length;
    else
        return this.audio_count;
};

localground.marker.prototype.getVideoCount = function() {
    if(this.videoIDs)
        return this.videoIDs.length;
    else
        return this.video_count;
};

localground.overlay.prototype.getName = function(name) {
	if(name == null)
        name = this.name;
	if(name == null || name.length == 0)
		name = 'Untitled';
	return name;
};

localground.marker.prototype.renderMarkerSection = function() {
    return $('<div></div>').css({'margin-bottom': '0px'});
};

localground.marker.prototype.showInfoBubbleView = function(opts) {
    this.renderMarkerDetail('buildSlideshow');
};

localground.marker.prototype.showInfoBubbleEdit = function(opts) {
    this.renderMarkerDetail('buildEditForm');
};

localground.marker.prototype.renderMarkerDetail = function(callback){
    var me = this;
    var callbackF = eval('localground.marker.prototype.' + callback);
    var $contentContainer = this.renderInfoBubble();
    $contentContainer.children().empty();
    if (this.requery || this.photos == null) {
        //requery for the latest marker data:
        $.getJSON(this.url, 
            function(result) {
                $.extend(me, result);
                me.requery = false;
                callbackF.call(me, $contentContainer);
            },
        'json');      
    }
    else {
        // Hack:  w/o the setTimeout method, twitter's widgets
        // don't work well with the infoBubble.  Tried catching th3
        // domready event, but it didn't work:
        // ----------------------------------------------------------
        // google.maps.event.addListenerOnce(self.infoBubble, 'domready', function(){
        //    //do stuff
        // });
        window.setTimeout(function() {
            callbackF.call(me, $contentContainer);
        }, 200);
         
    }
};

localground.marker.prototype.renderMarkerDetail1 = function(callback){
    /*
     * Theoretically, we shouldn't have to requery the server each time
     * we want to see the detailed marker display, but there's a bug in the
     * code.
    */
    var me = this;
    var $contentContainer = this.renderInfoBubble();
    $contentContainer.children().empty();
    
    // this is a bit of a hack, but it preserves the scope:
    var callbackF = eval('localground.marker.prototype.' + callback);
    //ensures that the marker renders on top:
    //this.googleOverlay.setMap(null);
    //this.googleOverlay.setMap(self.map);
    var r;
    //if (this.requery || this.photos == null)
    {
       //requery for the latest marker data:
       $.getJSON(this.url, 
            function(result) {
                $.extend(me, result);
                me.requery = false;
                callbackF.call(me, $contentContainer);
            },
        'json');    
    }
    /*else {
        $.extend(me, r);
        callbackF.call(me, $contentContainer);    
    }*/
};

localground.marker.prototype.buildSlideshow = function($contentContainer){
    //alert($contentContainer.get(0));
    $container = $('<div></div>');
    $contentContainer.append($container);
    self.slideshow.render_slideshow({
        marker: this,
        $container: $contentContainer,
        applyHack: true
    });
};

localground.marker.prototype.buildEditForm = function($contentContainer){
    var me = this;
    $container = $('<div />').css({'padding': '5px'});
    $contentContainer.append($container);
    var $ul = $('<ul />')
					.attr('id', 'marker-tabs')
					.addClass('tabs');
    var pages = [
        { id: 'detail', name: 'Detail'},
        { id: 'photo', name: 'Photos'},
        { id: 'audio', name: 'Audio'},
        { id: 'scan', name: 'Maps'},
        { id: 'data', name: 'Observations'}
    ];
    $.each(pages, function(index){
        $ul.append(
            $('<li />')
                .append($('<a />')
                    .attr('href', '#' + pages[index].id + '-' + 'marker')
                    .attr('data-toggle', 'tab')
                    .addClass('tab-' + pages[index].id)
                    .html(pages[index].name))
        );    
    });
    $container.append($ul);
	$tc = $('<div />').addClass("tab-content clearfix");
    $container.append($tc);
    $.each(pages, function(index){
        $tc.append(
            $('<div />')
                .addClass('tab-pane')
                .attr('id', pages[index].id + '-' + 'marker')
                .append(me.renderPanel(pages[index].id))
        );    
    });
    $('#marker-tabs a:first').tab('show');
    $('#marker-tabs a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});
};

localground.marker.prototype.renderPanel = function(key){
    var $overflower = $('<div />').css({ height: '280px', 'overflow-y': 'auto' });
                
    switch (key) {
        case 'detail':
            return $overflower.append(this.renderFormPanel());
        case 'photo':
            return $overflower.append(this.renderPhotoPanel());
        case 'audio':
            return $overflower.append(this.renderAudioPanel());
        //case 'maps':
        //    return $overflower.append(this.renderPhotoPanel());
    }
    return this.noChildrenMessage($overflower, 'Coming Soon');
};

localground.marker.prototype.noChildrenMessage = function($container, msg){
    $container.addClass('no-data-found').css({
        'height': this.bubbleHeight - 110
    });
    $container.append($('<div />').html(msg))
    return $container;   
};

localground.marker.prototype.renderPhotoPanel = function(){
    var me = this;
    var $container = $('<div />');
    if (this.photos.data.length == 0) {
        return this.noChildrenMessage($container, 'No photos have been added');
    }
    $.each(this.photos.data, function(idx) {
        var mini_me = this; //for scope purposes
        var $holder = $('<div />').css({
            'display': 'block',
            'margin-bottom': '6px',
            'border-bottom': 'solid 1px #eee'
        });
        $holder.append(
            $('<img />').addClass('thumb')
                 .css({'margin-right': '5px', 'vertical-align': 'top' })
                 .attr('src', this.path_marker_lg))
            .append(
                $('<p />').css({'display': 'inline-block', 'width': '385px' })
                    .append(
                        $('<span />').css({ 'font-weight': 'bold' })
                            .html(me.getName(this.name)))     
                    .append($('<br />'))
                    .append(this.caption)
                    .append($('<br />')) 
                    .append($('<a />').addClass('remove-photo')
                                .html('remove').click(function(){
                                    var $parent = $(this).parent().parent();
                                    me.detachMedia($parent, mini_me);
                                    return false;
                                }))     
            );
        $container.append($holder);
    });
    return $container;
};

localground.marker.prototype.renderFormPanel = function(){
    var me = this;
    var fields = this.getManager().getUpdateSchema();
    var form = new ui.form({
        schema: fields,
        object: this,
        exclude: ['point', 'project_id']
    });
    return form.render({
        height: 270,
        margin: '0px'
    });
};

localground.marker.prototype.renderAudioPanel = function(){
    var me = this;
    var $container = $('<div />');
    if (this.audio.data.length == 0) {
        return this.noChildrenMessage($container, 'No audio has been added');
    }
    $.each(this.audio.data, function(idx) {
        var mini_me = this;
        var $holder = $('<div />').css({
            'display': 'block',
            'margin-bottom': '6px',
            'border-bottom': 'solid 1px #eee'
        });
        $holder.append(
            $('<img />')
                 .css({'margin-right': '5px', 'vertical-align': 'top' })
                 .attr('src', '/static/images/headphones_medium.png'))
            .append(
                    $('<p />').css({
                        'display': 'inline-block', 
                        'width': '380px',
                    })
                    .append(
                        $('<span />').css({ 'font-weight': 'bold' })
                            .html(me.getName(this.name)))     
                    .append($('<br />'))
                    .append(this.caption)
                    .append($('<br />')) 
                    .append($('<a />')
                            .addClass('remove-audio')
                            .html('remove')
                            .click(function(){
                                var $parent = $(this).parent().parent();
                                me.detachMedia($parent, mini_me);
                                return false;
                    }))       
            );
        $container.append($holder);
    });
    return $container;
};

localground.marker.prototype.refresh = function() {
    this.image = this.markerImage = this.iconSmall = this.iconLarge =
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=0.5|0|' +
    this.color + '|13|b|';
    this.googleOverlay.setIcon(this.getIcon());
    localground.overlay.prototype.refresh.call(this);
};

localground.marker.prototype.makeViewable = function() {
	localground.point.prototype.makeViewable.call(this);
};

localground.marker.prototype.createNew = function(googleOverlay, projectID) {
    var me = this;
    $.ajax({
        url: '/api/0/markers/?format=json',
        type: 'POST',
        data: {
            lat: googleOverlay.getPosition().lat(),
            lng: googleOverlay.getPosition().lng(),
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

localground.marker.prototype.attachMedia = function(media) {
    var me = this;
	var url = this.url + media.managerID + '/.json';
	$.ajax({
        url: url,
        type: 'POST',
        data: {
            id: media.id,
            ordering: 1
        },
        success: function(data) {
            me.requery = true;
            me[media.overlay_type + '_count'] += 1;
            me.renderListing();
            me.googleOverlay.setIcon(me.markerImage);
            me.googleOverlay.setOptions({ 'draggable': true });
            me.closeInfoBubble();
        },
        notmodified: function(data) { alert('Not modified'); },
        error: function(data) {
            $('#update-marker-form').find('.clearfix').removeClass('error');
            var result = JSON.parse(data.responseText);
            for (var key in result) {
                var $form_element = $('#update-marker-form').find('#marker_' + key);
                if ($form_element.get(0)) {
                    $form_element.parent().parent().addClass('error');
                    $form_element.parent().prepend(result[key]);
                }
                else {
                    $('#error').show();
                    $('#error-message-text').html(result[key]);
                }
            }
            me.googleOverlay.setIcon(me.markerImage);
            me.googleOverlay.setOptions({ 'draggable': true });
            me.closeInfoBubble();
        }
    }); 
};

localground.marker.prototype.detachMedia = function($parent, media) {
    var me = this, url = media.relation;
    if (url.indexOf('.json') == -1) { url += '.json'; }                              
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function(data) {
            me.renderListing();
            var group_name = media.managerID;
			//todo:  this is throwing an error:  needs to be re-thought.  Fix
			// after Marker JSON is revamped to include dynamic data records
            switch (media.overlay_type) {
                case 'photo':
                    group_name = 'photos';
                    break;
                case 'scan':
                    group_name = 'scans';
                    break;
            }
            $.each(me[group_name].data, function(idx){
                if(this.id == media.id) {
                    me[group_name].data.splice(idx, 1);
                    return;
                }
            });
            me[media.overlay_type + '_count'] -= 1;
            var $contentContainer = $('#bubble_container');
            $contentContainer.empty();
            me.buildEditForm($contentContainer);
            //figure out how to select the right tab
            $('.tab-' + media.overlay_type).tab('show');
        },
        notmodified: function(data) { alert('Not modified'); },
        error: function(data) { alert('Error'); }
    });  
};


localground.marker.prototype.mouseoverF = function(){
	if(self.hideTip){ return; }
    var $innerObj = $('<div style="text-align:center" />')
                        .append(this.renderListingText());
	this.showTip({
		contentContainer: $innerObj,
        height: '40px',
        width: '200px'
	});
};



