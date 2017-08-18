var self;

localground.scans = function(){ };

localground.scans.prototype = new localground.profile(); // Here's where the inheritance occurs 

localground.scans.prototype.initialize=function(opts){
    self = this;
    localground.profile.prototype.initialize.call(this, opts);
    $('#reprocess').click(function() {
        self.reprocess();
    });
};

localground.scans.prototype.addObject = function() {
    var $msg = $('<div id="load_msg">Coming soon!</div>')
                    .css({
                        'width': '520px',
                        'height': '100px',
                        'text-align': 'center'
                    });
    $('#add-modal-body').empty().append($msg);
    $('#add-modal').modal('show');
};

localground.scans.prototype.reprocess = function() {
    var params = $('#the_form').serialize();
    $.post('/profile/map-image/reprocess/',
        params,
        function(result) {
            alert(JSON.stringify(result));
            $('#success-message').html(JSON.stringify(result));
        },
        'json');
}