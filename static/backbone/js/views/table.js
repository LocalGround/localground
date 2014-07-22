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
	["jquery", "lib/external/backbone-min", "backgrid", "views/tableEditor"],
	function($, Backbone, Backgrid, TableEditor) {
		$(function() {
			new TableEditor({
				a: 123
			});
		});
	}
);
