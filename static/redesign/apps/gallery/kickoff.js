require(
    ["jquery", "apps/gallery/gallery-app"],
    function ($, GalleryApp) {
        'use strict';
        $(function () {
            //window.location.hash = ''; //make sure the page initializes on the first page...
            var gallery = new GalleryApp();
            gallery.start();
        });
    }
);


