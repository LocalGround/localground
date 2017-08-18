var self;

localground.prints = function(){ };

localground.prints.prototype = new localground.profile(); // Here's where the inheritance occurs 

localground.prints.prototype.initImagePreviewer = function() {
    $('.thumb').click(function() {
        self.imageModal = new ui.dialog({
			id: 'image-modal',
			width: 740,
			height: 350,
			overflowY: 'auto',
			showTitle: false,
			innerContent: $('<img />').attr('src', $(this).next().val())
		});
		self.imageModal.show();
		return false;
    }).css({'cursor': 'pointer'}); 
};