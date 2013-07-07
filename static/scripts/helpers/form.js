ui.form = function(opts){
	/* Elements that are set by opts */
	this.schema;
	this.object;
	this.exclude = ['point', 'project_id'];
	$.extend(this, opts);
	this.id ='update-' + this.object.overlay_type + '-form';
};

ui.form.prototype.render = function() {
    var me = this;
	var obj = this.object;
    $form = $('<form />').attr('id', this.id);
	$.each(this.schema, function(){
		if($.inArray(this.field_name, me.exclude) == -1) {
			var $controlContainer = $('<div />').addClass('input');
			$controlContainer.append(me.renderControl(this))
			if (this.help_text) {
				$controlContainer.append(
					$('<span class="help-block" />').html(this.help_text));
			}
			$form.append(
				$('<div />').addClass('clearfix')
					.append(
						$('<label />').attr('for', this.field_name).html(this.label + ':')
					).append($controlContainer)
			);	
		}
		
	});
    $form.append(
        $('<div />').addClass('clearfix')
            .append(
                $('<div />').addClass('input')
                    .append(
                        $('<button />').addClass('btn primary')
                            .css({'margin-right': '5px'})
                            .html('Save')
                            .click(function(){
								/*var f = 'obj.update' + obj.overlay_type.capitalize() + '()';
								eval(f);*/
								me.update();
                                return false;
                            })
                            
                    ).append(
                        $('<button />').addClass('btn')
                            .html('Delete')
                            .click(function(){
                                /*var f = 'obj.delete' + obj.overlay_type.capitalize() + '()';
								eval(f);*/
								me.delete();
								return false;
                            })
                            
                    )		
            )
    );
	
	//add JavaScripts, if needed:
	//$('.tags')
	//	.autocomplete("/tagging_autocomplete/list/json", { multiple: true });            
	
	return $form;  
};

ui.form.prototype.renderControl = function(elem) {
	var $elem = null;
	switch(elem.type) {
		case 'memo':
			$elem = $('<textarea />')
				.attr('name', elem.field_name)
				.attr('id', 'marker_' + elem.field_name)
				.html(this.object[elem.field_name])
			break;
		case 'tags':
			$elem = $('<input />')
				.attr('name', elem.field_name)
				.attr('id', 'marker_' + elem.field_name)
				.attr('type','text')
				.attr('value', this.object[elem.field_name])
				.addClass('tags');
			break;
		default:
			$elem = $('<input />')
				.attr('name', elem.field_name)
				.attr('id', 'marker_' + elem.field_name)
				.attr('type','text')
				.attr('value', this.object[elem.field_name])
			break;
	}
	return $elem;
};

ui.form.prototype.update = function() {
	var obj = this.object, $form = $('#' + this.id), url = obj.url;
    if (url.indexOf('.json') == -1) { url += '.json'; }
	
	//get form elements:
	var elements = $form.serializeArray();
	data = {};
	$.each(elements, function(k, v){
		data[this['name']] = this['value'];	
	});
    
    $.ajax({
        url: url,
        type: 'PUT',
        data: data,
        success: function(data) {
            $.extend(obj, data);
            $('#success').show();
            $('#success-message-text').html('Your ' + obj.overlay_type + ' has been successfully updated.');
			obj.refresh();
        },
        notmodified: function(data) { alert('Not modified'); },
        error: function(data) {
            $('#update-marker-form').find('.clearfix').removeClass('error');
            var result = JSON.parse(data.responseText);
            for (var key in result) {
                var $form_element = $('#update-marker-form').find('#marker_' + key);
                if ($form_element.get(0)) {
                    $form_element.parent().parent().addClass('error');
                    $form_element.parent().prepend(result[key]);
                }
                else {
                    $('#error').show();
                    $('#error-message-text').html(result[key]);
                }
            }
        }
    });  	
};


ui.form.prototype.delete = function() {
    var obj = this.object, $form = $('#' + this.id), url = obj.url;
    if (url.indexOf('.json') == -1) { url += '.json'; }
	
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function(data) {
			$form.find('.clearfix').removeClass('error');
            $('#success').show();
            $('#success-message-text').html('Your ' + obj.overlay_type + ' has been successfully deleted.');
            obj.getManager().removeRecord(obj);
        },
        notmodified: function(data) { alert('Not modified'); },
        error: function(data) {
            $form.find('.clearfix').removeClass('error');
            var result = JSON.parse(data.responseText);
            for (var key in result) {
                $('#error').show();
                $('#error-message-text').append(result[key]);
            }
        }
    });   
};
