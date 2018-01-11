ui.filtermenu = function(opts){
    this.object_type = opts.object_type;
    this.rawURL = opts.rawURL;
    //alert(JSON.stringify(opts));
};

ui.filtermenu.prototype.initialize = function() {
    var me = this;
    $('#make-query').click(function(){
        var sql = '', val = '', intRegex = /^\d+$/;
        $('#filter-menu').find("input, select").each(function(){
            if($(this).val().length > 0) {
                if(sql.length > 0)
                    sql += ' and ';
                sql += $(this).attr('name') + ' ' + $(this).attr('data-operator') + ' ';
                switch($(this).attr('data-operator').toLowerCase()) {
                    case 'like':
                        val	= '\'%' + $(this).val() + '%\'';
                        break;
                    case 'within':
                        val = 'buffer' + $(this).val();
                        break;
                    case 'in':
                        var oldList = $(this).val().split(',');
                        var newList = [];
                        var elem = '';
                        $.each(oldList, function(){
                            elem = this.trim();
                            if(intRegex.test(elem))
                                newList.push(elem);
                            else
                                newList.push('\'' + elem + '\'');
                        });
                        val = '(' + newList.join(', ') + ')';
                        break;
                    default:
                        if(intRegex.test($(this).val()))
                            val = parseInt($(this).val());
                        else
                            val	= '\'' + $(this).val() + '\'';
                        break;
                }
                
                sql += val;
            }
        });
        if(sql.length > 0) 
            sql = 'SELECT * FROM ' + me.object_type + ' WHERE ' + sql;
        $('#sql').val(sql);
    });
    
    $('#do-query').click(function(){
        var url = me.rawURL;
        if($('#sql').val().length > 0)
            url += '?' + $.param({query: $('#sql').val()});
        document.location.href = url; 
    });
    
    $('.remove-filter').click(function(){
        //alert('remove!');
        id = $(this).attr('data-target');
        $(this).parent().remove();
        $('#' + id).val('');
        $('#make-query').trigger('click');
        $('#do-query').trigger('click');
        return false;
    });
    
    $('#remove-filters').click(function(){
        $(this).parent().remove();
        document.location.href = me.rawURL;
        return false;
    });
};
     