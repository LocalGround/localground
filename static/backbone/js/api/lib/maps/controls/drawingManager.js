define(["underscore"], function(_) {
	/** 
     * Class that lets a user delete a selected vertex of a path.
     * @class DrawingManager
     * @param {Sandbox} sb
     * The controller's sandbox interface
     */
	localground.maps.controls.DrawingManager = (function (sb) {
		this.dm = null;
		this.createSchema = null;
		this.polygonOptions = {
			strokeWeight: 0,
			fillOpacity: 0.45,
			editable: true
		};
		this.polylineOptions =  {
			editable: true
		};
		this.markerOptions = {
			draggable: true,
			icon: 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=0.5|0|CCCCCC|13|b|'
		};
		this.hiddenFields = [
			"geometry",
			"overlay_type",
			"url",
			"num",
			"manually_reviewed"
		];
		this.dataTypes = {
			'string': 'Text',
			'float': 'Number',
			'integer': 'Number',
			'boolean': 'Checkbox',
			'geojson': 'TextArea'
		};

		this.initialize = function(sb){
			this.sb = sb;
			this.dm = new google.maps.drawing.DrawingManager({
				//drawingMode: google.maps.drawing.OverlayType.MARKER,
				markerOptions: this.markerOptions,
				polylineOptions: this.polylineOptions,
				polygonOptions: this.polygonOptions,
				drawingControl: true,
				drawingControlOptions: {
					position: google.maps.ControlPosition.TOP_LEFT,
					drawingModes: [
						google.maps.drawing.OverlayType.MARKER,
						google.maps.drawing.OverlayType.POLYLINE,
						google.maps.drawing.OverlayType.POLYGON
					]
				},
				map: null
			});
			this.fetchCreateMetadata();
			this.attachEventHandlers();
		};
		
		this.attachEventHandlers = function(){
			var that = this;
			
			//add listeners:
			this.sb.listen({
				"mode-change" : this.changeMode
			});
			
			google.maps.event.addListener(this.dm, 'overlaycomplete', function(e) {
				switch(e.type) {
					case google.maps.drawing.OverlayType.MARKER:
						//var marker = new localground.marker();
						//marker.createNew(e.overlay, self.lastProjectSelection, this.accessKey);
						break;
					case google.maps.drawing.OverlayType.POLYLINE:
						//var polyline = new localground.polyline();
						//polyline.createNew(e.overlay, self.lastProjectSelection, this.accessKey);
						break;
					case google.maps.drawing.OverlayType.POLYGON:
						//var polygon = new localground.polygon();
						//polygon.createNew(e.overlay, self.lastProjectSelection, this.accessKey);
						break;
				}
				alert(e.overlay.position);	
				that.sb.notify({
					type: "create-bubble",
					data: {
						latLng: e.overlay.position,
						schema: that.createSchema
					}
				});
				that.dm.setDrawingMode(null);
			});
		};
		
		this.changeMode = function(){
			if (this.sb.getMode() == "view")
				this.hide();
			else
				this.show();
		};
		
		this.show = function(){
			this.dm.setMap(this.sb.getMap());
		};
		
		this.hide = function(){
			this.dm.setMap(null);
		};
		
		this.fetchCreateMetadata = function(){
			var that = this;
			$.ajax({
				url: '/api/0/markers/.json',
				type: 'OPTIONS',
				data: { _method: 'OPTIONS' },
				success: function(data) {
					//console.log(data);
					that.createSchema = that._generateSchema(data.actions['POST']);
				}
			});	
		};
		this._generateSchema = function(metadata) {
			if(metadata == null) {
				return null;
			}
			var schema = {};
			//https://github.com/powmedia/backbone-forms#schema-definition
			for (key in metadata) {
				var val = metadata[key];
				if (this.hiddenFields.indexOf(key) == -1 ) {
					if (!val.read_only) {
						schema[key] = {
							type: this.dataTypes[val.type] || 'Text',
							title: val.label || key,
							help: val.help_text
						};
					}
				}
			}
			return schema;
		}
	
		//call initialization function:
		this.initialize(sb);
	});
	
	
	
	//extend prototype so that this function is visible to the CORE:
	_.extend(localground.maps.controls.DrawingManager.prototype, {
		destroy: function(){
			this.hide();
		}
	});
	return localground.maps.controls.DrawingManager;
});