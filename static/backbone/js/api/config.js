define(
	[
		//"collections/projects",
		"collections/photos",
		"collections/audio",
		"collections/mapimages",
		"collections/markers",
		"text!../templates/sidepanel/photoItem.html",
		"text!../templates/sidepanel/audioItem.html",
		"text!../templates/sidepanel/mapimageItem.html",
		"text!../templates/sidepanel/markerItem.html",
		"text!../templates/sidepanel/recordItem.html",
		//"models/project",
		"models/photo",
		"models/audio",
		"views/maps/sidepanel/item",
		"models/mapimage"
	], function(
			Photos, AudioFiles, MapImages, Markers, //collections
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
			Collection: Photos,
			itemTemplateHtml: photoItem,
			ItemView: localground.maps.views.Item
		},
		audio: {
			Model: localground.models.Audio,
			Collection: AudioFiles,
			itemTemplateHtml: audioItem,
			ItemView: localground.maps.views.Item
		},
		scans: {
			Model: localground.models.MapImage,
			Collection: MapImages,
			itemTemplateHtml: mapimageItem,
			ItemView: localground.maps.views.Item
		},
		markers: {
			Model: localground.models.Marker,
			Collection: Markers,
			itemTemplateHtml: markerItem,
			ItemView: localground.maps.views.Item
		},
		form: {
			Model: localground.models.Marker,
			Collection: Markers,
			itemTemplateHtml: recordItem,
			ItemView: localground.maps.views.Item
		}
	};
	return localground.config.Config;
});
	
	