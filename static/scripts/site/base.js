var self = null;
localground.base = function(){
	this.errorDiv = null;	
};

localground.base.prototype.initialize = function(opts) {
	//alert('init base');
    self = this;
    this.setCookies(opts);
    this.initAjaxGlobalErrorHandling();
	$('.close').click(function(){
       $(this).parent().hide();
       $('#alert-message-text').empty();
    });
};

localground.base.prototype.disableEnterKey = function(e)
{
	var key;
	if(window.event)
        key = window.event.keyCode; //IE
    else
        key = e.which; //firefox
    if(key == 13)
        return false;
    else
        return true;
};

localground.base.prototype.displayMessage = function(messages, opts){
	if(opts == null) { opts = {}; }
	var cls = 'alert-message block-message shadow';
	if(opts.error) { cls += ' error'; }
	var title = opts.title || 'Notice';
	this.errorDiv = null;
	this.errorDiv = $('<div id="errorDiv" />').addClass(cls)
		.css({
			margin: '20px 300px 20px 300px',
			float: 'left',
			width: 600,
			position: 'absolute',
			top: $(window).scrollTop(),
			left: 0,
			'z-index': 5000000001
		})
		.append(
			$('<a />').attr('href', '#').addClass('close').html('&times;')
			.click(function(){
				$(this).parent().prev().remove();
				$(this).parent().remove();
				$(window).unbind('scroll');
			})
		)
		.append($('<h3 />').append(title));
	 var $ul = $('<ul></ul>');
	 $.each(messages, function() {
		$ul.append($('<li></li>').html(this.toString()));	
	});
	this.errorDiv.append($ul);
	var $shroud = $('<div></div>').css({
			width:'100%',
			height: $('body').height() + 100,
			top: 0,
			left: 0,
			position: 'absolute',
			'z-index': 5000000000,
			'background-color': 'rgba(100, 100, 100, 0.75)'
	}).click(function() {
		$(this).next().remove();
		$(this).remove();	
	});
	$('body').append($shroud);
	$('body').append(this.errorDiv);
	$(window).scroll(function() {
		$('#errorDiv').css({'top': $(window).scrollTop()});	
	});
};

localground.base.prototype.setCookies = function(opts) {
	//todo:  move to context processors?
	//alert(JSON.stringify(opts));
	var username = opts.username;
	if(username == null) {
		//alert('Please add username to opts');
		return;
	}
    var expiry = 31;
    if(opts.project_id)
        $.cookie('project_id_' + username, opts.project_id, { path: '/', expires: expiry });
    if(opts.alias)
        $.cookie('alias_' + username, opts.alias, { path: '/', expires: 1 });
	if(opts.formID)
		$.cookie('form_id_' + username, opts.formID, { path: '/', expires: 1 });
	if(opts.style)
		$.cookie('style_' + username, opts.style, { path: '/', expires: 1 });
	if(opts.page)
		$.cookie('page_' + username, opts.page, { path: '/', expires: 1 });
};

localground.base.prototype.initAjaxGlobalErrorHandling = function() {
    //really cool global error handling for jQuery ajax requests
    //todo:  move to more global javascript class
    $.ajaxSetup({
		beforeSend:function(){
            $('#loading_message').show();
        },
		complete:function(){
            $('#loading_message').hide();
        },
		error:function(x,e){
            switch(x.status) {
                case 0:
                    alert('You are offline!!\n Please Check Your Network.');
                    return;
                case 404:
                    alert('Requested URL not found.');
                    return;
                case 500:
                    alert('Internal Server Error.');
                    return;
            }
            switch(e) {
                case 'parsererror':
                    alert('Error.\nParsing JSON Request failed.');
                    return;
                case 'timeout':
                    alert('Request timed out.');
                    return;
            }
            alert('Unknown Error.\n' + x.responseText);
		}
	});   
};