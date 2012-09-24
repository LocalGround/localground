ui.dialog = function(opts){
    this.id = 'modal';
    this.$modal = null;
    this.width = 560;
    this.height = 300;
    this.minHeight = 120;
    this.iframeURL = null;
    this.innerContent = null;
    this.showTitle = false;
    this.title = null;
    this.submitButtonText = 'Save';
    this.closeExtras = function() {};
    this.submitFunction = null;
    this.overflowY = 'hidden';
    this.overflowX = 'hidden';
    $.extend(this, opts);
    this.update();
};

ui.dialog.prototype.update = function() {
    //update dialog width & height:
    this.$modal = this.getModal();
    this.$modal.css({
        'width':this.width,
        'margin-left': -1*parseInt(this.width/2)
    });
    if(this.iframeURL != null)
        this.innerContent = this.getIframe(); 

    var modalBodyWidth = this.width - 25;
    if(this.overflowY != 'hidden')
        modalBodyWidth -= 10;
    this.$modal.find('.modal-body')
        .css({
            'width': modalBodyWidth,
            'margin-top': 25,
            'overflow-x': this.overflowX,
            'overflow-y': this.overflowY,
            'height': this.height,
            'max-height': $(window).height() - 150
        })
        .empty()
        .append(this.innerContent);
    if(this.iframeURL != null)
        this.$modal.append(this.getLoadingImage());
};

    
    
ui.dialog.prototype.show = function() {
    this.$modal.modal('show');   
};

ui.dialog.prototype.hide = function() {
    this.$modal.modal('hide');   
};

ui.dialog.prototype.getModal = function() {
    var me = this;
    var $modal = $('#' + this.id);
    if($modal.get(0) == null) {
        $modal = $('<div id="' + this.id + '" class="modal hide"></div>');
        if(this.showTitle) {
            $modal.append(
                $('<div class="modal-header"></div>').append(
                    $('<a href="#" class="close">&times;</a>') 
                ).append(
                    $('<h3></h3>').html(this.title) 
                ));    
        }
        else {
            $modal.append(
                $('<a href="#" class="close">&times;</a>').css({'margin-right': 10}));    
        }
        $modal.append($('<div class="modal-body" style="min-height: ' + this.minHeight + '"></div>'));
        $modal.append(
            $('<div class="modal-footer"> \
                <button class="btn hide">Close</button> \
                <button class="btn primary">' + me.submitButtonText + '</button> \
            </div>'));
        $('body').append($modal);
        $modal.find('.hide').click(function(){
            me.hide();     
        });
        
        //add an update / save button:
        if(me.iframeURL != null) {
            $modal.find('.modal-footer').find('.primary').click(function(){
                var $iframe = $('#the_frame');
                $iframe.contents().find('form:eq(0)').submit();
                $iframe.css({ 'visibility': 'hidden' });
                $modal.find('.modal-body').prepend(
                    me.getLoadingImage()    
                );
                return false;
            });
        }
        else if(me.submitFunction != null) {
            $modal.find('.modal-footer').find('.primary').click(function(){
                me.submitFunction();
            });
        }
        else {
            $modal.find('.primary').hide();
        }
        $modal.modal({
            keyboard: true,
            backdrop: true,
            closeExtras: this.closeExtras
        });
    }
    return $modal;
};

ui.dialog.prototype.getLoadingImage = function() {
    return $('<div id="loading-image"></div>')
        .css({
            'position': 'absolute',
            'width': this.width - 25,
            'text-align': 'center',
            'top': 50
        })
        .append($('<img />')
        .attr('src', '/site_media/images/ajax-loader.gif'));
};

ui.dialog.prototype.getIframe = function() {
    var me = this;
    
    return $('<iframe></iframe>')
        .css({
            'width': this.width - 25,
            'height': this.height,
            'margin': 0,
            'display': 'block',
            'overflow': 'auto',
            'visibility': 'hidden',
            'max-height': $(window).height() - 100
        })
        .attr('id', 'the_frame')
        .attr('frameborder', 0)
        .attr('src', this.iframeURL)
        .load(function() {
            $(this).css({
                'visibility': 'visible'
            });
            var is_success = (
                $('#the_frame').contents().find('.alert-message.success').get(0) != null
            );
            if(is_success)
                me.$modal.find('.hide').html('Done');
            $('#loading-image').remove();
        });  
};

