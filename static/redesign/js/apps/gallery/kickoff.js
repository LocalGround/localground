require(
    ["jquery", "js/apps/gallery/gallery-app.js"],
    function ($, GalleryApp) {
        'use strict';
        $(function () {
            window.location.hash = ''; //make sure the page initializes on the first page...
            var gallery = new GalleryApp();
            gallery.start();
        });
    }
);


