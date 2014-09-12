define([
	"jquery",
	"jquery.bootstrap",
	"core",
	"sandbox",
	"views/maps/basemap",
	"lib/maps/data/dataManager",
	"views/maps/sidepanel/dataPanel",
	"views/maps/overlays/overlayManager",
	"views/maps/overlays/bubbleManager",
	"lib/maps/controls/deleteMenu",
	"lib/maps/controls/drawingManager"
   ],
	function($, bootstrap, CORE, Sandbox) {
	
		localground.maps.views.MapEditor = function(opts){
			CORE.create_module("basemap", localground.maps.views.Basemap, opts);
			CORE.create_module("data-manager", localground.maps.data.DataManager);
			CORE.create_module("data-panel", localground.maps.views.DataPanel);
			CORE.create_module("overlay-manager", localground.maps.views.OverlayManager);
			CORE.create_module("bubble-manager", localground.maps.views.BubbleManager);
			
			// really, these are submodules of the map; not sure how this should
			// be organized. But nice that they're stand-alone:
			CORE.create_module("delete-menu", localground.maps.controls.DeleteMenu);
			CORE.create_module("map-drawing-toolbar", localground.maps.controls.DrawingManager);
			
			CORE.start_all();
		};
		return localground.maps.views.MapEditor;
	});