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
    this.map_image_count = 0;
    this.photoIDs = null;
    this.audioIDs = null;
    this.recordIDs = null;
    this.color = 'CCCCCC'
    this.accessKey = null;
    this.managerID = null;
    if(opts)
        $.extend(this, opts);
	this.image = this.markerImage = this.iconSmall = this.iconLarge =
        '//chart.googleapis.com/chart?chst=d_map_spin&chld=0.5|0|' +
        this.color + '|13|b|';
    this.bubbleWidth = 480;
    this.bubbleHeight = 360;
    this.overlayType = "marker";
    
    //extend this class with the createmixin functions too:
    extend(localground.marker.prototype, localground.createmixin.prototype);

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
        messages.push(this.getRecordCount() + ' data record(s)');
    $div_text.append('<br><span>' + messages.join(', ') + '</span>');
    return $div_text;
};

localground.marker.prototype.getPhotoCount = function() {
    return this.photo_count;
};

localground.marker.prototype.getAudioCount = function() {
    return this.audio_count;
};

localground.marker.prototype.getRecordCount = function() {
    return this.record_count;
};

localground.marker.prototype.getVideoCount = function() {
    return this.video_count;
};

localground.marker.prototype.getName = function(name) {
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
    if (opts == null)
	opts = {};
    $.extend(opts, {
	width: '250px',
	height: '140px'
    });
    if (this.photo_count == 0) {
	//build bubble content:
	var $container = $('<div />');
	$container.append(this.renderDetail());
	var $contentContainer = this.renderInfoBubble(opts);
	$contentContainer.append($container);
    }
    else {
	this.renderMarkerDetail('buildSlideshow');
    }
};

localground.marker.prototype.showInfoBubbleEdit = function(opts) {
    this.renderMarkerDetail('buildEditForm');
};

localground.marker.prototype.renderMarkerDetail = function(callback){
    var me = this;
    var callbackF = eval('localground.marker.prototype.' + callback);
    var $contentContainer = this.renderInfoBubble({});
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
        { id: 'map_image', name: 'Maps'},
        { id: 'record', name: 'Form Data'}
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
            return this.renderFormPanel($overflower);
        case 'photo':
            return this.renderPhotoPanel($overflower);
        case 'audio':
            return this.renderAudioPanel($overflower);
        case 'map_image':
			return this.renderMapPanel($overflower);
		case 'record':
			return this.renderRecordPanel($overflower);
    }
    return this.noChildrenMessage($overflower, 'Coming Soon');
};

localground.marker.prototype.noChildrenMessage = function($container, msg){
    $container.addClass('no-data-found').css({
        'height': this.bubbleHeight - 100
    });
    $container.append($('<div />').html(msg))
    return $container;   
};

localground.marker.prototype.renderPhotoPanel = function($container){
    var me = this;
    //var $container = $('<div />');
    if (this.children.photos == null || this.children.photos.data.length == 0) {
        return this.noChildrenMessage($container, 'No photos have been added');
    }
    $.each(this.children.photos.data, function(idx) {
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
                                .html('detach').click(function(){
                                    var $parent = $(this).parent().parent();
									me.detachMedia($parent, mini_me, 'photos');
                                    return false;
                                }))     
            );
        $container.append($holder);
    });
    return $container;
};

localground.marker.prototype.renderMapPanel = function($container){
	if (this.map_image_count == 0) {
        $container = this.noChildrenMessage($container, 'No map images have been added');
	$container.find('div').append(
	    $('<button />').addClass('btn primary')
		.css({'margin-top': '10px'})
		.html("Append Visible Maps")
		.click(function(){
			alert('append');	
		})
	);
	return $container;
    }
    return null;
};

localground.marker.prototype.renderRecordPanel = function($container){
    var me = this;
    //var $container = $('<div />');
	if (this.record_count == 0) {
        return this.noChildrenMessage($container, 'No form data has been added');
    }
	$container.css({
		'margin-right': '8px',
		'margin-left': '8px'
	});
	for (k in this.children) {
		if (k.indexOf('form_') != -1 &&
				this.children[k].data &&
				this.children[k].data.length > 0) {
			var group_name = k;
			var table = this.children[k];
			$container.append($('<h3></h3>').html(table.name));
			
			var $tbl = $('<table />')
							.addClass('tbl-slim-marker');
			var $header_row = $('<tr />')
								.append($('<th />').html('&nbsp;'))
								.append($('<th />').html('ID'))
								.append($('<th />').html('Num'));
			$.each(table.headers, function(){
				$header_row.append(
					$('<th />').html(this.toString())
				);	
			});
			$tbl.append($header_row);
			var cell_val;
			$.each(table.data, function(){
				var mini_me = this;
				var $detach = $('<a />').html('detach');
				// Closure function ensures that the group_name variable
				// maintains scope.  A little hacky, but it works:
				function detach(group_name){
					return function() {
						var $parent = $(this).parent().parent();
						me.detachMedia($parent, mini_me, group_name);
						return false;
					};
				}
				$detach.bind('click', detach(group_name));
				var $row = $('<tr />')
							.append($('<td />').append($detach))
							.append($('<td />').html(this.id))
							.append($('<td />').html(this.num));
				$.each(this.recs, function(elem){
					$row.append(
						$('<td />').html(elem ? elem.toString() : '')
					);	
				});
				$tbl.append($row);
			});
			$container.append($tbl);
		}
	}
	return $container;
};

localground.marker.prototype.renderFormPanel = function($container){
    var me = this;
    var fields = this.getManager().getUpdateSchema();
    var form = new ui.form({
        schema: fields,
        object: this,
        exclude: ['geometry', 'project_id']
    });
    return $container.append(form.render({
        height: this.bubbleHeight - 125,
        margin: '0px'
    }));
};

localground.marker.prototype.renderAudioPanel = function($container){
    var me = this;
    //var $container = $('<div />');
    if (this.children.audio == null || this.children.audio.data.length == 0) {
        return this.noChildrenMessage($container, 'No audio has been added');
    }
    $.each(this.children.audio.data, function(idx) {
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
                            .html('detach')
                            .click(function(){
                                var $parent = $(this).parent().parent();
                                me.detachMedia($parent, mini_me, 'audio');
                                return false;
                    }))       
            );
        $container.append($holder);
    });
    return $container;
};

localground.marker.prototype.refresh = function() {
    this.image = this.markerImage = this.iconSmall = this.iconLarge =
    '//chart.googleapis.com/chart?chst=d_map_spin&chld=0.5|0|' +
    this.color + '|13|b|';
    this.googleOverlay.setIcon(this.getIcon());
    localground.overlay.prototype.refresh.call(this);
};

localground.marker.prototype.makeViewable = function() {
	localground.point.prototype.makeViewable.call(this);
};


localground.marker.prototype.attachMedia = function(media) {
    var me = this;
	var url = this.url.split('.json')[0] + media.managerID + '/.json';
	//alert(url);
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

localground.marker.prototype.detachMedia = function($parent, media, group_name) {
	var me = this;
	var url = me.children[group_name].attach_url;
	url = url.split('.json')[0] + media.id + '/.json';
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function(data) {
            $.each(me.children[group_name].data, function(idx){
                if(this.id == media.id) {
                    me.children[group_name].data.splice(idx, 1);
                    return;
                }
            });
            me[media.overlay_type + '_count'] -= 1;
            me.renderListing();
            var $contentContainer = $('#bubble_container');
            $contentContainer.empty();
            me.buildEditForm($contentContainer);
            
			// select the right tab
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



