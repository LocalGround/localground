localground.slideshow = function(){
    this.player = null;
    this.id = 'slideshow-carousel';
};

localground.slideshow.prototype.initialize=function(opts){
    if(opts){ $.extend(this, opts); }
    this.player = new localground.player({mode: 'small'});
    this.player.initialize(opts);
    if(opts.renderFlashPlayer)
        $('body').append(this.player.renderFlashObject(opts));
};

localground.slideshow.prototype.generateCarousel = function() {
    return $('<div />').addClass('carousel slide').attr('id', this.id)
        .append(
            $('<div />').addClass('carousel-inner'))
        .append(
            $('<a />').addClass('left carousel-control')
                .attr('href', '#' + this.id)
                .attr('data-slide', 'prev').html('&lsaquo;'))
        .append(
            $('<a />').addClass('right carousel-control')
                .attr('href', '#' + this.id)
                .attr('data-slide', 'next').html('&rsaquo;')
        );
};

/*localground.slideshow.prototype.showModal = function() {
    this.generateCarousel();            
    //initialize player:
    $('#slide-modal').find('.modal-body').empty();
    
    //initialize empty carousel:
    //$('#slide-modal').find('.modal-body').append(this.carousel);
    $('#slide-modal').modal();
};*/

            
localground.slideshow.prototype.render_slideshow = function(opts) {
    var marker = opts.marker, $container = opts.$container;
    $container.append(this.generateCarousel());
    this.render_photo_slides(marker);
    this.render_data_slides(marker);
    this.render_audio(marker);
    
    var $c = $('#' + this.id).carousel();
    if(opts.applyHack) {
        $('.left, .right').click('[data-slide]', function(e){
            var $this = $(this), href
            , $target = $c, options = $.extend({}, $target.data(), $this.data())
          $target.carousel(options)
          e.preventDefault()  
        });
    }
}

localground.slideshow.prototype.render_audio = function(marker) {
    var me = this;
    if(marker.audio == null || marker.audio.length == 0){ return; }
    var playerHtml = this.player.renderPlayerObject();
    $('#' + this.id).append(
        $('<div />').addClass('audio-controller')
            .append(playerHtml)
    );
    $.each(marker.audio, function(idx) {
        if(idx > 0)
            playerHtml.append($('<input type="hidden" />').val(this.path));    
        else
            playerHtml.find('input').val(this.path);
    });
    this.player.initialize();
};
            
localground.slideshow.prototype.render_photo_slides = function(marker) {
    var me = this;
    $.each(marker.photos, function(idx) {
        var $item = $('<div />').addClass('item')
                .append($('<img />').attr('src', this.path_large))
                .append($('<div />').addClass('carousel-caption')
                    .append($('<h4 />').html(this.name))
                    .append($('<p />').html(this.caption))
                );
        if(idx == 0) { $item.addClass('active'); }
        $('#' + me.id).find('.carousel-inner').append($item);
    });
};
localground.slideshow.prototype.render_data_slides = function(marker) {
    var me = this;
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
            $('#' + me.id).find('.carousel-inner').append($item);
        });
    });
};


            
localground.slideshow.prototype.get_photos_by_marker_id = function(id) {
    var me = this;
    var url = '/api/0/get/marker/' + id + '/';
    $.getJSON(url, {},
        function(result) {
            if(!result.success) {
                alert(result.message);
                return;
            }
            me.render_slides(result.obj);
            me.render_audio(result.obj);
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
            $.each(result.data, function() {
                if(this.id == 'photo') {
                    me.render_photos(this.data);
                    me.render_audio([]);
                }
            });
        },
    'json');   
};