var self;

localground.forms = function(opts){
    this.fieldsModal = null;
    this.addModal = null;
    this.objectType = null;
	this.modalWidth = 660;
	$.extend(this, opts);
};

localground.forms.prototype = new localground.profile(); // Here's where the inheritance occurs 

localground.forms.prototype.initialize=function(opts){
    localground.profile.prototype.initialize.call(this, opts);
    
    $('.fields').click(function(){
		self.loadFieldsForm($(this).parents('tr').find('.checkone').val());
		return false;
    });
}

localground.forms.prototype.loadFieldsForm = function(objectID) {
    var url = '/profile/forms/' + objectID + '/embed/';
    this.fieldsModal = new ui.dialog({
        id: 'fields-modal',
        width: self.modalWidth,
        //height: 400,
        iframeURL: url,
        showTitle: false,
        submitButtonText: 'save changes',
        closeExtras: function() {
            if($('#fields-modal').find('.hide').html() == 'Done')
                document.location.href = self.pageURL;
        }
    });
    this.fieldsModal.show();
};
