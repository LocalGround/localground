localground.slideshow = function(){
    this.player = null;
};

localground.slideshow.prototype.initialize=function(opts){
    if(opts){ $.extend(this, opts); }
    this.player = new localground.player({mode: 'small'});
    this.player.initialize(opts);
    if(opts.renderFlashPlayer)
        $('body').append(this.player.renderFlashObject(opts));
};

localground.slideshow.prototype.generateCarousel = function(id) {
    //initialize player:
    $('#slide-modal').find('.modal-body').empty();
    
    //initialize empty carousel:
    $('#slide-modal').find('.modal-body').append(
        $('<div />').addClass('carousel slide').attr('id', id)
            .append(
                $('<div />').addClass('carousel-inner'))
            .append(
                $('<a />').addClass('left carousel-control')
                    .attr('href', '#' + id)
                    .attr('data-slide', 'prev').html('&lsaquo;'))
            .append(
                $('<a />').addClass('right carousel-control')
                    .attr('href', '#' + id)
                    .attr('data-slide', 'next').html('&rsaquo;')
            )
    );
};
            
localground.slideshow.prototype.get_photos_by_marker_id = function(id, counter) {
    var me = this;
    var url = '/api/0/get/marker/' + id + '/';
    $.getJSON(url, {},
        function(result) {
            if(!result.success) {
                alert(result.message);
                return;
            }
            me.render_slides(result.obj, counter);
            me.render_audio(result.obj, counter);
            $('#slide-modal').modal();    
        },
    'json');   
};
            
localground.slideshow.prototype.get_photos_by_project_id = function(id) {
    var me = this;
    var params = {
        include_processed_maps: true,
        include_markers: true,
        include_audio: true,
        include_photos: true
    };
    var url = '/api/0/projects/' + 97 + '/';
    $.getJSON(url, params,
        function(result) {
            if(!result.success) {
                alert(result.message);
                return;
            }
            $.each(result.data, function(counter) {
                if(this.id == 'photo') {
                    me.render_photos(this.data, counter);
                    me.render_audio([], counter);
                }
            });
        },
    'json');   
};
            
localground.slideshow.prototype.render_audio = function(marker, counter) {
    if(marker.audio == null || marker.audio.length == 0){ return; }
    var playerHtml = this.player.renderPlayerObject();
    $('#c_' + counter).append(
        $('<div />').addClass('audio-controller')
            .append(playerHtml)
    );
    
    this.player.initialize();
    $.each(marker.audio, function(idx) {
        if(idx > 0)
            playerHtml.append($('<input type="hidden" />').val(this.path));    
        else
            $('#c_' + counter).find('input').val(this.path);
    });
};
            
localground.slideshow.prototype.render_slides = function(marker, counter) {
    this.generateCarousel('c_' + counter);
    $.each(marker.photos, function(idx) {
        var $item = $('<div />').addClass('item')
                .append($('<img />').attr('src', this.path_large))
                .append($('<div />').addClass('carousel-caption')
                    .append($('<h4 />').html(this.name))
                    .append($('<p />').html(this.caption))
                );
        if(idx == 0) { $item.addClass('active'); }
        $('#c_' + counter).find('.carousel-inner').append($item);
    });
    $.each(marker.tables, function(idx) {
        var tableName = this.name;
        $.each(this.data, function(){
            var $data = $('<div />').css({'padding': '20px 0px 0px 70px'});
            this.noMap = true;
            var record = new localground.record(this, null, this.id);
            $data.append(record.renderSlideRecord());
            var $item = $('<div />').addClass('item')
                    .append($('<div />').css({
                        height: '450px',
                        width: '600px',
                        color: '#fff',
                        display: 'block'
                    }).append($data))
                    .append($('<div />').addClass('carousel-caption')
                        .append($('<h4 />').html(tableName)
                        .append($('<p />').html('&nbsp;'))
                    ));
            $('#c_' + counter).find('.carousel-inner').append($item);
        });
    });
    $('#c_' + counter).carousel();
};