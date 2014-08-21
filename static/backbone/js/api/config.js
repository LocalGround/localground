define(
	[
		"text!../templates/sidepanel/photoItem.html",
		"text!../templates/sidepanel/audioItem.html",
		"text!../templates/sidepanel/mapimageItem.html",
		"text!../templates/sidepanel/markerItem.html",
		"text!../templates/sidepanel/recordItem.html",
		"text!../templates/infoBubble/photo.html",
		"text!../templates/infoBubble/photoTip.html",
		"text!../templates/infoBubble/audio.html",
		"text!../templates/infoBubble/audioTip.html",
		"text!../templates/infoBubble/genericTip.html",
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
			photoTipTemplate, audioBubbleTemplate, audioTipTemplate,
			genericTipTemplate
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
			InfoBubbleTemplate: photoBubbleTemplate,
			TipTemplate: photoTipTemplate
		},
		audio: {
			Model: localground.models.Audio,
			Collection: localground.collections.AudioFiles,
			Overlay: localground.maps.overlays.Audio,
			ItemTemplate: audioItemTemplate,
			InfoBubbleTemplate: audioBubbleTemplate,
			TipTemplate: audioTipTemplate
		},
		scans: {
			Model: localground.models.MapImage,
			Collection: localground.collections.MapImages,
			Overlay: localground.maps.overlays.Marker,
			ItemTemplate: mapimageItemTemplate,
			InfoBubbleTemplate: audioBubbleTemplate,
			TipTemplate: genericTipTemplate
		},
		markers: {
			Model: localground.models.Marker,
			Collection: localground.collections.Markers,
			Overlay: localground.maps.overlays.Marker,
			ItemTemplate: markerItemTemplate,
			InfoBubbleTemplate: audioBubbleTemplate,
			TipTemplate: genericTipTemplate
		},
		form: {
			Model: localground.models.Marker,
			Collection: localground.collections.Markers,
			Overlay: localground.maps.overlays.Marker,
			ItemTemplate: recordItemTemplate,
			InfoBubbleTemplate: audioBubbleTemplate,
			TipTemplate: genericTipTemplate
		}
	};
	return localground.config.Config;
});
	
	