var self;

localground.forms = function(){
    this.fieldsModal = null;
    this.addModal = null;
    this.objectType = null;
};

localground.forms.prototype = new localground.profile(); // Here's where the inheritance occurs 

localground.forms.prototype.initialize=function(opts){
    localground.profile.prototype.initialize.call(this, opts);
    //if(opts) {
    //    $.extend(this, opts);
    //}
    
    $('.fields').click(function(){
        return self.loadFieldsForm($(this).parents('tr').find('.checkone').val())
    });
}

localground.forms.prototype.loadFieldsForm = function(objectID) {
    var url = '/profile/forms/' + objectID + '/embed/';
    this.fieldsModal = new ui.dialog({
        id: 'fields-modal',
        width: 560,
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
    return false;
};