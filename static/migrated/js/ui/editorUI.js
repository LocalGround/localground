localground.Editor = (function () {	
	var managers = {
		"photo": { records: [] },
		"audio": { records: [] },
		"grocery_table": { records: [] }
	};
	var defaultLocation = {
		center: new google.maps.LatLng(40.91351257612757, -123.4423828125),
		zoom: 14
	};
	var map = null;
	var router = null;
	var overlays = null;
	var views = {};
	var templates = new localground.Templates();
	var layerManager = new localground.LayerManager();
	var activeMapTypeID = 12;
	
	/***************************************************
	 * Public methods
	 ***************************************************/
	this.initialize = function(opts) {
		activeMapTypeID = opts.activeMapTypeID;
		overlays = opts.overlays;
		
		templates.loadTemplates([
				"top_nav",
				"side_panel",
				"symbols_panel"
			], function() {
			initBackbone(opts);
		});
	};
	
	/***************************************************
	 * Private methods
	 ***************************************************/
	var initBackbone = function(opts){
		views = {
			topNav: new TopNavigation({
				template: templates.get("top_nav"),
				el: "nav"
			}),
			rightPanel: new RightPanel({
				template: templates.get("side_panel"),
				el: "#panel"
			}),
			basemap: new Basemap(),
			layerList: new LayerList()
		}
		router = new Router();
		router.on("route:home", function(){
			//alert("home");
			//initButtons();
			initData();
			//populate the panels:
			views.topNav.render();
			views.rightPanel.render();
			views.basemap.render({
				mapContainerID: "map_canvas",
				defaultLocation: defaultLocation,
				searchControl: true,
				geolocationControl: true,
				activeMapTypeID: activeMapTypeID,
				overlays: overlays
			});
		});
		router.on("route:loadSymbols", function(){
			views.layerList.render({
				template: templates.get("symbols_panel"),
				el: "#symbols_panel"
			});
		});
		Backbone.history.start();
	};
	
	var initButtons = function() {
		alert("initButtons!")
		var that = this;
		$("#add_symbol").click(function(){
			layerManager.createLayer(map, managers);
			$("#new_layer_panel").show();
			$("#layers").hide();
			return false;
		});
		
		$("#new_layer_panel").find("input").click(function(){
			layerManager.preview();
		});
		
		$("#new_layer_panel").find("input").blur(function(){
			layerManager.preview();	
		});
		
		$("#marker_cancel").click(function(){
			cancel();
			return false;
		});
		
		$("#symbol_type").change(function(){
			if($(this).val() != "-1") {
				layerManager.createLayer(map, managers);
			}
		});
		
		$("#code_symbol").click(function(){
			layerManager.showCode();
			return false;
		});
		
		$("#save_symbol").click(function(){
			save.call(that);
			return false;
		});
		
	};
	
	var showListingPanel = function(){
		$("#new_layer_panel").hide();
		$("#layers").show();
		if (layerManager.size() == 0) {
			$("#layers > div").hide();
			$("#layers > span").show();
		}
		else {
			$("#layers > div").show();
			$("#layers > span").hide();
		}
	};
		
	var cancel = function() {
		layerManager.cancelAdd();
		showListingPanel();
	};
	
	var save = function(){
		layerManager.addLayer();
		return false;
	};
	
	var initData = function(){
		var tags = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
		for(key in managers) {
			for (var i = 0; i <= 200; i++) {
				managers[key].records.push({
					name: "Name " + (i+1),
					latLng: generateRandomPoint(),
					tags: tags[i % 7]
				});
			}
		}
	};
	
	var generateRandomPoint = function(){
		var randX = Math.random();
		var randY = Math.random();
		var signX = Math.floor(Math.random() * 2) + 1;
		var signY = Math.floor(Math.random() * 2) + 1;
		if(signX == 2) randX *= -1;
		if(signY == 2) randY *= -1;
		return new google.maps.LatLng(
			defaultLocation.center.lat() + (randX * 0.1),
			defaultLocation.center.lng() + (randY * 0.1)
		);
	};
	
	return this;
	
});

