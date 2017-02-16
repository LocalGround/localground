define(["marionette", "underscore", "lib/maps/icon-lookup"], function (Marionette, _, IconLookup) {
    "use strict";
    var Icon = Marionette.ItemView.extend({
        fillColor: '#ed867d',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 1,
        strokeOpacity: 1,
        initialize: function (opts) {
            if (opts.key) {
                _.extend(this, IconLookup.getIcon(opts.key));
            }
            _.extend(this, opts);
            this.scale = this.getScale();
            this.viewBox = this.getViewBox();
        },
        getViewBox: function () {
            return '-1 -1 ' + (this.baseWidth + 1) + ' ' + (this.baseHeight + 2);
        },
        getScale: function () {
            return this.width / this.baseWidth;
        },
        generateGoogleIcon: function () {
            return {
                fillColor: this.fillColor,
                fillOpacity: this.fillOpacity,
                strokeColor: this.strokeColor,
                strokeWeight: this.strokeWeight,
                strokeOpacity: this.strokeOpacity,
                path: this.path,
                scale: this.getScale()
            };
        }
    });
    return Icon;
});