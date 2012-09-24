var self;
localground.permissions = function(){
    this.noUsers = false;
    this.prefix = null;
    this.formError = false;
};

localground.permissions.prototype = new localground.base(); //alert(noUsers);

localground.permissions.prototype.init = function(opts){
    self = this;
    if(opts) {
        $.extend(this, opts);
    }
    //1) initialize the form and the dynamic form generator:
    this.initFormset();
    
    //2) if no sharing has been established, hide the users table, and initialize
    //   an empty record:
    $('#user-share-div').find('.add-row').click(function(){
        $('#tbl').show();
        $('#user-share-div').hide();
        return false;
    });
    $('#user-share-div').hide();
    if(this.noUsers && !this.formError) {
        $('#tbl').hide();
        $('#user-share-div').show();
        this.initRow($('#tbl').find('tr:eq(1)'));
    }
    
    //3) initialize the project-level authority form (hide access key field
    //   unless selected).
    if($('#id_access_authority').val() != "2")
        $('#id_access_key').parent().parent().hide();  
    $('#id_access_authority').change(function(){
        if($(this).val() == "2") {
            $('#id_access_key').parent().parent().show();
            if($('#id_access_key').val() == '')
                self.generateKey();
        }
        else {
            $('#id_access_key').parent().parent().hide();
        }	
    });
    $('#id_access_key').parent().append(
        $('<a href="javascript:void(0)">Generate New Key</a>')
            .click(self.generateKey)
    );
    
    //4) if there were update errors and the username wasn't found in the
    //   database, ensure that auto-select is visible so that the user can
    //   try again:
    $('#tbl tbody tr').each(function(){
        self.initRow($(this), false);
        if($(this).find('td:eq(0)').hasClass('error')) {
            $(this).find('td:eq(0)').append(
                $('<ul class="errorlist"></ul>')
                    .append($(
                        '<li>The user you selected wasn\'t found in the database</li>'))
            );
        }
    });
    
    this.setSlug();
    //5) pre-populate slug if empty:
    $('#id_name').blur(function(){
        self.setSlug();
    });
};

localground.permissions.prototype.generateKey = function(){
    var $elem = $('#id_access_key');
    digits = 16;
    key = '';
    var str =   'abcdefghijklmnopqrstuvwxyz' +
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
                '1234567890';
    while(digits > 0) {
        idx = Math.random()*str.length;
        key += str.substring(idx,idx+1);
        --digits;  
    }
    $elem.val(key);
};

localground.permissions.prototype.initNewRow = function($elem) {
    self.initRow($elem, true);   
};

localground.permissions.prototype.initRow = function($elem, isNew) {
    /***
    This function adds some extra functionality so that the user
    autocomplete works and the UI is customized for the permissions
    forms (adding new users to views and projects)
    */
    var $cell0 = $elem.find('td:eq(0)');
    // if it's a new row, clear out old row's id (pk):
    if(isNew || $cell0.find('input:eq(0)').val() == '') {
        $elem.find('td:eq(2)').find('input').val('');
        // remove user label:
        $cell0.find('span').first().remove();
        this.replaceWithAutocomplete($cell0);
        $elem.find('select').val('');
    }
    else {
        if(!$cell0.hasClass('error'))
            $cell0.find('input:eq(0)').hide();    
    }
    
};

localground.permissions.prototype.replaceWithAutocomplete = function($elem) {
    // 1) delete and re-add text input (workaround to get autocomplete):
    var $input_old = $elem.find('input:eq(0)');
    var $username_input = $('<input type="text" />')
            .attr('id', $input_old.attr('id'))
            .attr('name', $input_old.attr('name'));
    $elem.append($username_input);
    $input_old.remove();
    
    // 2) attach auto-complete functionality (using jquery ui):
    $username_input.autocomplete({
        source: '/profile/get-contacts/json/',
        delay: 200,
        multiple: false,
        select: function(event, ui) {
            $(this).val(ui.item.label);
            return false;
        }
    });   
};

localground.permissions.prototype.initFormset = function() {	
    $('#tbl tbody tr').formset({
        extraClasses: ['row1', 'row2'],
        prefix: this.prefix,
        addText: 'add new user',
        deleteText: '&times;',
        deleteCssClass: 'close',
        added: self.initNewRow,
        removed: function() {
            var visibleRows = 0;
            $('#tbl tbody tr').each(function(){
                if($(this).is(':visible')) ++visibleRows;
            });
            if(visibleRows == 1) {
                $('#tbl').hide();
                $('#user-share-div').show();
                $('#tbl').find('.add-row').trigger('click');
            }
        }
    });
};

localground.permissions.prototype.setSlug = function() {
    if($('#id_slug').val() == '') {
        var slug = $('#id_name').val().replace(/[^\w\s]/gi, '');
        slug = slug.replace(/\ /g, '-').toLowerCase();
        $('#id_slug').val(slug);    
    }
};
