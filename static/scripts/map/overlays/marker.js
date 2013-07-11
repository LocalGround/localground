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
    if(opts)
        $.extend(this, opts);
    this.managerID = this.overlay_type = self.overlay_types.MARKER;
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
    //alert(JSON.stringify(this.photos));
    $container = $('<div></div>');
    $contentContainer.append($container);
    self.slideshow.render_slideshow({
        marker: this,
        $container: $container,
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
    var pages = ['Detail', 'Photos', 'Audio', 'Maps', 'Observations'];
    $.each(pages, function(index){
        $ul.append(
            $('<li />')
                .append($('<a />')
                        .attr('href', '#' + pages[index].toLowerCase() + '-' + 'marker')
                        .attr('data-toggle', 'tab')
                        .html(pages[index]))
        );    
    });
    $container.append($ul);
	$tc = $('<div />').addClass("tab-content clearfix");
    $container.append($tc);
    $.each(pages, function(index){
        $tc.append(
            $('<div />')
                .addClass('tab-pane')
                .attr('id', pages[index].toLowerCase() + '-' + 'marker')
                .append(me.renderPanel(pages[index].toLowerCase()))
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
        case 'photos':
            return $overflower.append(this.renderPhotoPanel());
        case 'audio':
            return $overflower.append(this.renderAudioPanel());
        //case 'maps':
        //    return $overflower.append(this.renderPhotoPanel());
    }
    return $overflower.append('Not implemented yet.');
};

localground.marker.prototype.renderPhotoPanel = function(){
    var me = this;
    var $container = $('<div />');
    $.each(this.photos.data, function(idx) {
        var mini_me = this; //for scope purposes
        var $holder = $('<div />').css({'display': 'block'});
        $holder.append(
            $('<img />').addClass('thumb')
                 .css({'margin-right': '5px', 'vertical-align': 'top' })
                 .attr('src', this.path_marker_lg))
            .append(
                $('<p />').css({'display': 'inline-block' })
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

localground.marker.prototype.detachMedia = function($parent, media) {
    var me = this, url = media.relation;
    if (url.indexOf('.json') == -1) { url += '.json'; }                              
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function(data) {
            $parent.remove();
            me[media.overlay_type + '_count'] -= 1;
            me.renderListing();
        },
        notmodified: function(data) { alert('Not modified'); },
        error: function(data) { alert('Error'); }
    });  
};

localground.marker.prototype.renderFormPanel = function(){
    var me = this;
    var fields = this.getManager().getUpdateSchema();
    var form = new ui.form({
        schema: fields,
        object: this,
        exclude: ['point', 'project_id']
    });
    return form.render();
};

localground.marker.prototype.renderAudioPanel = function(){
    var $container = $('<div />');
    $.each(this.audio.data, function(idx) {
        var $holder = $('<div />').css({'display': 'block'});
        $holder.append(
            $('<img />')
                 .css({'margin-right': '5px', 'vertical-align': 'top' })
                 .attr('src', '/static/images/headphones_small.png'))
            .append(
                $('<p />').css({'display': 'inline-block' })
                    .append(
                        $('<span />').css({ 'font-weight': 'bold' })
                            .html(me.getName(this.name)))     
                    .append($('<br />'))
                    .append(this.caption)
                    .append($('<br />')) 
                    .append($('<a />').addClass('remove-audio').attr('href', '#').html('remove'))       
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
            //alert(JSON.stringify(data));
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
    url = this[media.overlay_type + '_links'];
    if (url.indexOf('.json') == -1) { url += '.json'; }
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
        }
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


localground.marker.prototype.renderInfoBubbleHeader_deleteme = function($container) {
    var me = this;
    if(this.isEditMode()) {
        $container.append(
            $('<div />').addClass('clearfix')
                .append($('<img />')
                            .attr('src', this.image)
                            .attr('id', 'color-preview')
                            .css({
                                'float':'left',
                                'margin-right': '5px',
                                'cursor':' pointer'
                            })
                            .click(function(){
                                me.getManager().toggleIconChooser();    
                            })
                ).append($('<h4></h4>').html('Marker Information'))
            );
        var $form =  $('<form class="embed" style="clear:both" />');
        var $div = $('<div />').addClass('clearfix');
        $div.append(
            $('<label />').html('Name')
        ).append(
            $('<div />').addClass('input').append(
                $('<input type="text" />')
                    .attr('id', 'marker_name')
                    .attr('value', this.name))
        )
        $form.append($div);
        $div = $('<div />').addClass('clearfix');
        $div.append(
            $('<label />').html('Description')
        ).append(
            $('<div />').addClass('input').append(
                $('<textarea />')
                    .attr('id', 'marker_desc')
                    .html(this.description))
        )
        $form.append($div);
        $div = $('<div />').addClass('clearfix');
        $div.append(
            $('<label />').html('Color')
        ).append(
            $('<div />').addClass('input').append(
                $('<input />')
                    .attr('id', 'marker_color')
                    .val(this.color))
        )
        $form.append($div);
        $container.append($form);
    }
    else {
        if(this.description && this.description.length > 0)
            $container.append(
                $('<p></p>').html(this.description)                        
            );
    }
};

localground.marker.prototype.renderInfoBubblePhotos_deleteme = function($container) {
    if(this.photoIDs == null) return;
    var me = this;
    $section = this.renderMarkerSection();
    if(this.isEditMode())
        $section.attr('id', 'marker_photos').css({
            width: 400    
        });
    else
        $section.attr('id', 'marker_photos').css({
            width: 3000    
        });
    $container.append($section);
    $section.append($('<h4></h4>').html('Photos'));
    $.each(this.photoIDs, function(idx){
        var photo = me.getManagerById(self.overlay_types.PHOTO).getDataElementByID(this);
        //if(idx<4)
        {
            $div = $('<div />').css({
                'width': '130px',
                'height': '116px',
                'margin-right': '3px',
                'display': 'inline-block'
            })
            $photoDiv = $('<div />').css({
                'overflow': 'hidden',
                'width': '128px',
                'height': '96px',
                'border': 'solid 1px #666'
            }).append(
                $('<img />')
                    .attr('src', photo.path_small)
                    .css({ 'min-width': '128px' })
            );
            $div.append($photoDiv);
            if(me.isEditMode()) {
                $div.append(
                    $('<a href="#">remove</a>').click(function(){
                        me.removeFromMarker($(this), photo);
                    })
                );
            }
            $section.append($div);
        }
    });
};

localground.marker.prototype.renderInfoBubbleAudio_deleteme = function($container) {      
    if(this.audioIDs == null) return;
    var me = this;
    $section = this.renderMarkerSection();
    $container.append($section);
    $section.append($('<h4></h4>').html('Audio Files'));
    var $ul = $('<ul />');
    $section.append($ul);
    $.each(this.audioIDs, function(idx){
        var audio = me.getManagerById(self.overlay_types.AUDIO).getDataElementByID(this);
        var $li = $('<li />')
                        .css({
                            'line-height': '15px',
                            'margin-bottom': '8px'
                    }).append(audio.name);
        $li.append($('<br>'))
            .append($('<a class="play_link" href="#">play</a>')
                .click(function() {
                    $('#player').show();
                    $('#audio_url').val(audio.path);
                    $('.play').triggerHandler('click');
                    return false;
                })
            );
        
        if(me.isEditMode()) {
            $li.append('&nbsp;|&nbsp;').append(
                $('<a href="#">remove</a>').click(function(){
                    me.removeFromMarker($(this), audio);
                })
            );
        }
        $ul.append($li);
    });
};

localground.marker.prototype.renderInfoBubbleRecords_deleteme = function($container) { 
    if(this.recordIDs == null) return;
    var me = this;
    $section = this.renderMarkerSection();
    $container.append($section);
    var reviewsRendered = 0;
    $.each(this.recordIDs, function(key, val){
        var table = me.getManagerById(key);
        $section.append($('<h4></h4>').html(table.name));
        $.each(val, function(){
            var record = table.getDataElementByID(this);
            if(reviewsRendered > 0)
                $section.append('<hr>');
            $div = record.renderMarkerRecord();
            if(me.isEditMode()) {
                $div.prepend('&nbsp;').append(
                    $('<a href="#">remove</a>').click(function(){
                        me.removeFromMarker($(this), record);
                    })
                );
            }    
            $section.append($div);
            ++reviewsRendered;
        });
    });
};



