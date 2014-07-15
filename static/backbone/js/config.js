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
		"text!templates/photoItem.html",
		"text!templates/audioItem.html",
		"text!templates/mapimageItem.html",
		"text!templates/markerItem.html",
		"text!templates/recordItem.html"
	], function(
			Project, Photo, Audio, MapImage, Marker, //models
			Projects, Photos, AudioFiles, MapImages, Markers, //collections
			photoItem, audioItem, mapimageItem, markerItem, recordItem //templates
		) {
	var Config = {
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
	return Config;
});
	
	