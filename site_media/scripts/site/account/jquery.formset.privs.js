/*(function($) {
    var plugin = $['fn']['formset'].prototype;
    
    // store copies of the original plugin functions before overwriting
    var functions = {};
    for (var i in plugin) {
        if (typeof(plugin[i]) === 'function') {
            functions[i] = plugin[i];
        }
    }

    // extend existing functionality of the autocomplete plugin
    $.extend(true, plugin, {
        addRow: function($elem) {
            alert('does this work?');
            functions["addRow"].call(this, $elem);
        }
    });
})(jQuery);*/

/*
(function($) {

    var extensionMethods = {

        addRow: function($elem) {
            alert('does this work?');
            //functions["addRow"].call(this, $elem);
        }
    };

    $.extend($.fn.formset.prototype, extensionMethods);


})(jQuery);
alert($.fn.formset.applyExtraClasses);
*/
/*
(function($){
    var dialogExtensions ={
        oldClose: $.ui.dialog.prototype.close,
        close: function(event){
            this.oldClose(event);
            // custom code
        } 
    };
    $.extend($.ui.dialog.prototype, dialogExtensions);
})(jQuery);*/

