define(
	[
		"text!../templates/sidepanel/photoItem.html",
		"text!../templates/sidepanel/audioItem.html",
		"text!../templates/sidepanel/mapimageItem.html",
		"text!../templates/sidepanel/markerItem.html",
		"text!../templates/sidepanel/recordItem.html",
		"text!../templates/infoBubble/photo.html",
		"text!../templates/infoBubble/audio.html",
		"collections/photos",
		"collections/audio",
		"collections/mapimages",
		"collections/markers",
		"lib/maps/overlays/photo",
		"lib/maps/overlays/marker",
		"lib/maps/overlays/audio"
	], function(
			photoItemTemplate, audioItemTemplate, mapimageItemTemplate,
			markerItemTemplate, recordItemTemplate, photoBubbleTemplate,
			audioBubbleTemplate
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
			Overlay: localground.maps.overlays.Photo,
			ItemTemplate: photoItemTemplate,
			InfoBubbleTemplate: photoBubbleTemplate
		},
		audio: {
			Model: localground.models.Audio,
			Collection: localground.collections.AudioFiles,
			Overlay: localground.maps.overlays.Audio,
			ItemTemplate: audioItemTemplate,
			InfoBubbleTemplate: audioBubbleTemplate
		},
		scans: {
			Model: localground.models.MapImage,
			Collection: localground.collections.MapImages,
			Overlay: localground.maps.overlays.Marker,
			ItemTemplate: mapimageItemTemplate,
			InfoBubbleTemplate: audioBubbleTemplate
		},
		markers: {
			Model: localground.models.Marker,
			Collection: localground.collections.Markers,
			Overlay: localground.maps.overlays.Marker,
			ItemTemplate: markerItemTemplate,
			InfoBubbleTemplate: audioBubbleTemplate
		},
		form: {
			Model: localground.models.Marker,
			Collection: localground.collections.Markers,
			Overlay: localground.maps.overlays.Marker,
			ItemTemplate: recordItemTemplate,
			InfoBubbleTemplate: audioBubbleTemplate
		}
	};
	return localground.config.Config;
});
	
	