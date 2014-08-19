define(
	[
		"text!../templates/sidepanel/photoItem.html",
		"text!../templates/sidepanel/audioItem.html",
		"text!../templates/sidepanel/mapimageItem.html",
		"text!../templates/sidepanel/markerItem.html",
		"text!../templates/sidepanel/recordItem.html",
		"collections/photos",
		"collections/audio",
		"collections/mapimages",
		"collections/markers",
		"lib/maps/overlays/photo",
		"lib/maps/overlays/marker",
		"lib/maps/overlays/audio"
	], function(
			photoItem, audioItem, mapimageItem, markerItem, recordItem //templates
		) {
	/**
	 * Convenience object for connecting data models with
	 * their corresponding JavaScript classes
	 * @class
	*/
	localground.config.Config = {
		photos: {
			Model: localground.models.Photo,
			Collection: localground.collections.Photos,
			itemTemplateHtml: photoItem,
			Overlay: localground.maps.overlays.Photo
		},
		audio: {
			Model: localground.models.Audio,
			Collection: localground.collections.AudioFiles,
			itemTemplateHtml: audioItem,
			Overlay: localground.maps.overlays.Audio
		},
		scans: {
			Model: localground.models.MapImage,
			Collection: localground.collections.MapImages,
			itemTemplateHtml: mapimageItem,
			Overlay: localground.maps.overlays.Marker
		},
		markers: {
			Model: localground.models.Marker,
			Collection: localground.collections.Markers,
			itemTemplateHtml: markerItem,
			Overlay: localground.maps.overlays.Marker
		},
		form: {
			Model: localground.models.Marker,
			Collection: localground.collections.Markers,
			itemTemplateHtml: recordItem,
			Overlay: localground.maps.overlays.Marker
		}
	};
	return localground.config.Config;
});
	
	