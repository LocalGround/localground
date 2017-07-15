define([
    "apps/gallery/views/create-media"
], function (CreateMedia) {
    'use strict';

    var MedaBrowserUploader = CreateMedia.extend({
        initialize: function (opts) {
            CreateMedia.prototype.initialize.call(this, opts);
        }
    });
    return MedaBrowserUploader;

});
