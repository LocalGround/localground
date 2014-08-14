define(
	[
		"models/project",
		"models/photo",
		"models/audio",
		"models/mapimage",
		"models/marker",
		"collections/projects",
		"collections/photos",
		"collections/audio",
		"collections/mapimages",
		"collections/markers",
		"text!../templates/sidepanel/photoItem.html",
		"text!../templates/sidepanel/audioItem.html",
		"text!../templates/sidepanel/mapimageItem.html",
		"text!../templates/sidepanel/markerItem.html",
		"text!../templates/sidepanel/recordItem.html"
	], function(
			Project, Photo, Audio, MapImage, Marker, //models
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
			itemTemplateHtml: photoItem
		},
		audio: {
			Model: Audio,
			Collection: AudioFiles,
			itemTemplateHtml: audioItem
		},
		scans: {
			Model: MapImage,
			Collection: MapImages,
			itemTemplateHtml: mapimageItem
		},
		markers: {
			Model: Marker,
			Collection: Markers,
			itemTemplateHtml: markerItem
		},
		form: {
			Model: Marker,
			Collection: Markers,
			itemTemplateHtml: recordItem
		}
	};
	return localground.config.Config;
});
	
	