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
			itemTemplateHtml: photoItem
		},
		audio: {
			Model: localground.models.Audio,
			Collection: localground.collections.AudioFiles,
			itemTemplateHtml: audioItem
		},
		scans: {
			Model: localground.models.MapImage,
			Collection: localground.collections.MapImages,
			itemTemplateHtml: mapimageItem
		},
		markers: {
			Model: localground.models.Marker,
			Collection: localground.collections.Markers,
			itemTemplateHtml: markerItem
		},
		form: {
			Model: localground.models.Marker,
			Collection: localground.collections.Markers,
			itemTemplateHtml: recordItem
		}
	};
	return localground.config.Config;
});
	
	