define(["marionette", "underscore", "lib/maps/icon-lookup"], function (Marionette, _, IconLookup) {
    "use strict";
    var Icon = Marionette.ItemView.extend({
        fillColor: '#ed867d',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 1,
        strokeOpacity: 1,
        initialize: function (opts) {
            if (opts.shape) {
                _.extend(this, IconLookup.getIcon(opts.shape));
            }
            _.extend(this, opts);
            this.scale = this.getScale();
            this.viewBox = this.viewBox || this.getViewBox();
        },
        getViewBox: function () {
            return (-1 * this.strokeWeight) + ' ' +
                    (-1 * this.strokeWeight) + ' ' +
                    (this.baseWidth + this.strokeWeight + 2) + ' ' +
                    (this.baseHeight + this.strokeWeight + 2);
        },
        getScale: function () {
            var scale = this.width / this.baseWidth;
            //console.log(scale);
            return scale;
        },
        generateGoogleIcon: function () {
            return {
                fillColor: this.fillColor,
                fillOpacity: this.fillOpacity,
                strokeColor: this.strokeColor,
                strokeWeight: this.strokeWeight,
                strokeOpacity: this.strokeOpacity,
                path: this.path,
                markerSize: this.width,
                scale: this.getScale(),
                anchor: new google.maps.Point(this.anchor[0], this.anchor[1]),
                url: this.url,
                //size: new google.maps.Size(this.width, this.height),
                origin: this.origin || new google.maps.Point(0, 0),
                viewBox: this.getViewBox(),
                width: this.width,
                height: this.height
            };
        }
    });
    return Icon;
});