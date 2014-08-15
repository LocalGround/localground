define(
	[
		"models/project",
		"models/photo",
		"models/audio",
		"collections/projects",
		"collections/photos",
		"collections/audio",
		"collections/mapimages",
		"collections/markers",
		"text!../templates/sidepanel/photoItem.html",
		"text!../templates/sidepanel/audioItem.html",
		"text!../templates/sidepanel/mapimageItem.html",
		"text!../templates/sidepanel/markerItem.html",
		"text!../templates/sidepanel/recordItem.html",
		"views/maps/sidepanel/photoItem",
		"models/mapimage"
	], function(
			Project, Photo, Audio, //models
			Projects, Photos, AudioFiles, MapImages, Markers, //collections
			photoItem, audioItem, mapimageItem, markerItem, recordItem //templates
		) {
	/**
	 * Convenience object for connecting data models with
	 * their corresponding JavaScript classes
	 * @class
	*/
	localground.config.Config = {
		photos: {
			Model: Photo,
			Collection: Photos,
			itemTemplateHtml: photoItem,
			ItemView: localground.maps.views.PhotoItem
		},
		audio: {
			Model: Audio,
			Collection: AudioFiles,
			itemTemplateHtml: audioItem,
			ItemView: localground.maps.views.PhotoItem
		},
		scans: {
			Model: localground.models.MapImage,
			Collection: MapImages,
			itemTemplateHtml: mapimageItem,
			ItemView: localground.maps.views.PhotoItem
		},
		markers: {
			Model: localground.models.Marker,
			Collection: Markers,
			itemTemplateHtml: markerItem,
			ItemView: localground.maps.views.PhotoItem
		},
		form: {
			Model: localground.models.Marker,
			Collection: Markers,
			itemTemplateHtml: recordItem,
			ItemView: localground.maps.views.PhotoItem
		}
	};
	return localground.config.Config;
});
	
	