require.config({
	baseUrl: "js",
	paths: {
		'jquery': '//code.jquery.com/jquery-1.8.0.min',
		'text': 'lib/external/text',
		'jquery.bootstrap': '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min',
        'backgrid': 'lib/external/backgrid.min'
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
			deps: ['jquery', 'lib/external/backbone-min', 'lib/external/underscore-min'],
			exports: 'Backgrid'
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
		var vent = _.extend({}, Backbone.Events);
		$(function() {
			$.ajaxSetup({
				beforeSend: function(xhr, settings){
					$('#loading_message').show();
					xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
				}
			});
			
			var tableEditor = new TableEditor({
				vent: vent
			});
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
