define(
    [
        "text!../templates/sidepanel/photoItem.html",
        "text!../templates/sidepanel/audioItem.html",
        "text!../templates/sidepanel/mapimageItem.html",
        "text!../templates/sidepanel/markerItem.html",
        "text!../templates/sidepanel/recordItem.html",
        "text!../templates/infoBubble/photo.html",
        "text!../templates/infoBubble/photoTip.html",
        "text!../templates/infoBubble/mapImage.html",
        "text!../templates/infoBubble/audio.html",
        "text!../templates/infoBubble/audioTip.html",
        "text!../templates/infoBubble/marker.html",
        "text!../templates/infoBubble/markerTip.html",
        "text!../templates/infoBubble/record.html",
        "text!../templates/infoBubble/recordTip.html",
        "text!../templates/infoBubble/genericTip.html",
        "collections/photos",
        "collections/audio",
        "collections/mapimages",
        "collections/markers",
        "collections/records",
        "models/photo",
        "models/marker",
        "models/audio",
        "models/record",
        "models/mapimage",
        "lib/maps/overlays/photo",
        "lib/maps/overlays/marker",
        "lib/maps/overlays/map-image",
        "lib/maps/overlays/audio",
        "lib/maps/overlays/record",
        "views/maps/sidepanel/items/photoItem",
        "views/maps/sidepanel/items/markerItem",
        "views/maps/sidepanel/items/item",
        "views/maps/sidepanel/items/audioItem"
    ],
    function (photoItemTemplate, audioItemTemplate, mapimageItemTemplate, markerItemTemplate, recordItemTemplate,
                 photoBubbleTemplate, photoTipTemplate, mapImageBubbleTemplate, audioBubbleTemplate, audioTipTemplate, markerBubbleTemplate,
                 markerTipTemplate, recordBubbleTemplate, recordTipTemplate, genericTipTemplate, Photos, AudioFiles, MapImages, Markers,
                 Records, Photo, Marker, Audio, Record, MapImage, PhotoOverlay, MarkerOverlay, GroundOverlay, AudioOverlay,
                 RecordOverlay, PhotoItem, MarkerItem, GenericItem, AudioItem) {
        "use strict";
        /**
         * Convenience object for connecting data models with
         * their corresponding JavaScript classes
         * @class
         */
        var Config = {
            photos: {
                Model: Photo,
                Collection: Photos,
                Overlay: PhotoOverlay,
                ItemTemplate: photoItemTemplate,
                InfoBubbleTemplate: photoBubbleTemplate,
                TipTemplate: photoTipTemplate,
                ItemView: PhotoItem
            },
            audio: {
                Model: Audio,
                Collection: AudioFiles,
                Overlay: AudioOverlay,
                ItemTemplate: audioItemTemplate,
                InfoBubbleTemplate: audioBubbleTemplate,
                TipTemplate: audioTipTemplate,
                ItemView: AudioItem
            },
            map_images: {
                Model: MapImage,
                Collection: MapImages,
                Overlay: GroundOverlay,
                ItemTemplate: mapimageItemTemplate,
                InfoBubbleTemplate: mapImageBubbleTemplate,
                TipTemplate: genericTipTemplate,
                ItemView: GenericItem
            },
            markers: {
                Model: Marker,
                Collection: Markers,
                Overlay: MarkerOverlay,
                ItemTemplate: markerItemTemplate,
                InfoBubbleTemplate: markerBubbleTemplate,
                TipTemplate: markerTipTemplate,
                ItemView: MarkerItem
            },
            form: {
                Model: Record,
                Collection: Records,
                Overlay: RecordOverlay,
                ItemTemplate: recordItemTemplate,
                InfoBubbleTemplate: recordBubbleTemplate,
                TipTemplate: recordTipTemplate,
                ItemView: GenericItem
            }
        };
        return Config;
    }
);