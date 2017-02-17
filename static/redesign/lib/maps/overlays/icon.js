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
            this.viewBox = this.getViewBox();
        },
        getViewBox: function () {
            return '-1 -1 ' + (this.baseWidth + 1) + ' ' + (this.baseHeight + 2);
        },
        getScale: function () {
            var scale = this.width / this.baseWidth;
            //console.log(scale);
            return scale;
        },
        generateGoogleIcon: function () {
            //console.log(this.width, this.height);
            return {
                fillColor: this.fillColor,
                fillOpacity: this.fillOpacity,
                strokeColor: this.strokeColor,
                strokeWeight: this.strokeWeight,
                strokeOpacity: this.strokeOpacity,
                anchor: new google.maps.Point(
                    this.width / 2,
                    this.height / 2
                ),
                path: this.path,
                scale: this.getScale()
            };
        }
    });
    return Icon;
});