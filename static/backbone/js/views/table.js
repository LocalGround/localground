require.config({
	baseUrl: "js",
	paths: {
		'jquery': '//code.jquery.com/jquery-1.8.0.min',
		'text': 'lib/external/text',
		'jquery.bootstrap': '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min',
        'backbone': 'lib/external/backbone-min',
		'backgrid': 'lib/external/backgrid.min',
		'form': 'lib/external/backbone-forms',
		'underscore': 'lib/external/underscore-min',
		'bootstrap-form-templates': 'lib/external/backbone-forms-bootstrap3-templates',
		'backbone-bootstrap-modal': 'lib/external/backbone.bootstrap-modal'
	},
	shim: {
		'lib/external/underscore-min': {
			exports: '_'
		},
		'lib/external/backbone-min': {
			deps: ["lib/external/underscore-min", "jquery"],
			exports: 'Backbone'
		},
		'jquery.bootstrap': {
			deps: ['jquery']
		},
		'backgrid': {
			deps: ['lib/external/backbone-min'],
			exports: 'Backgrid'
		},
		'bootstrap-form-templates': {
			deps: ['lib/external/backbone-min'],
		},
		'backbone-bootstrap-modal': {
			deps: ['lib/external/backbone-min', 'jquery.bootstrap'],
		},
		'lib/external/colResizable-1.3.source': {
			deps: ['jquery'],
			exports: 'colResizable'
		}
	},
	urlArgs: "bust=" + (new Date()).getTime()
});
require(
	["jquery", "lib/external/backbone-min", "backgrid", "views/tableEditor", "jquery.bootstrap"],
	function($, Backbone, Backgrid, TableEditor) {
		$(function() {
			$.ajaxSetup({
				beforeSend: function(xhr, settings){
					$('#loading_message').show();
					xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
				}
			});
			//initialize new table editor!
			new TableEditor();
		});
	}
);

//todo: move this to some helper functions file:
function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) == (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}
