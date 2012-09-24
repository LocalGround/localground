function MyAccount() {
    this.numSliders = 0;
};

MyAccount.prototype.initialize = function(opts) {
    this.numSliders = opts.numSliders;
    for(i=0; i<this.numSliders; i++) {
        $("#slider_" + (i+1)).easySlider({
            auto: false, 
            continuous: true,
            numeric: true,
            controlsShow: true,
            speed: 800,
            pause: 8000
        });
    }
    $('img').css({'visibility': 'visible'});
};