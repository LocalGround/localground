var self;

localground.groups = function(){
    this.shareModal = null;
    this.addModal = null;
    this.objectType = null;
};

localground.groups.prototype = new localground.profile(); // Here's where the inheritance occurs 

localground.groups.prototype.initialize=function(opts){
    localground.profile.prototype.initialize.call(this, opts);
    //if(opts) {
    //    $.extend(this, opts);
    //}
    
    $('.share').click(function(){
        return self.loadShareForm($(this).parents('tr').find('.checkone').val())
    });
}

localground.groups.prototype.loadShareForm = function(objectID) {
    var url = '/profile/' + this.object_type_plural + '/' + objectID + '/share/embed/';
    this.shareModal = new ui.dialog({
        id: 'share-modal',
        width: 560,
        //height: 400,
        iframeURL: url,
        showTitle: false,
        submitButtonText: 'save changes',
        closeExtras: function() {
            if($('#share-modal').find('.hide').html() == 'Done')
                document.location.href = self.pageURL;
        }
    });
    this.shareModal.show();
    return false;
};