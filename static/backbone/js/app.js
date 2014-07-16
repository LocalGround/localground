require.config({
	paths: {
		'jquery': 'lib/external/jquery-1.11.1.min',
		'text': 'lib/external/text'
	},
	shim: {
		'lib/external/underscore-min': {
			exports: '_'
		},
		'lib/external/backbone-min': {
			deps: ["lib/external/underscore-min", "jquery"],
			exports: 'Backbone'
		}
	},
	urlArgs: "bust=" + (new Date()).getTime()
});


require(
	["jquery", "views/mapEditor"],
	function($, MapEditor) {
		$(function() {
			new MapEditor();
		});
	}
);

