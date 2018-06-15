define(["marionette", "underscore", "lib/maps/icon-lookup"], function (Marionette, _, IconLookup) {
    "use strict";
    var Icon = Marionette.ItemView.extend({
        fillColor: '#ED867D',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 1,
        strokeOpacity: 1,
        initialize: function (opts) {
            if (opts.shape) {
                _.extend(this, IconLookup.getIcon(opts.shape));
            }
            _.extend(this, opts);
            /*if (!opts.fillColor) {
                delete opts.fillColor;
            }*/
            this.scale = this.getScale();
            this.viewBox = this.viewBox || this.getViewBox();
        },
        getViewBox: function () {
            //console.log(this.strokeWeight, this.baseWidth, this.baseHeight, this.strokeWeight);
            return (-0.5 * this.strokeWeight) + ' ' +
                    (-0.5 * this.strokeWeight) + ' ' +
                    (this.baseWidth + this.strokeWeight) + ' ' +
                    (this.baseHeight + this.strokeWeight);
        },
        getScale: function () {
            var scale = this.width / this.baseWidth;
            return scale;
        },
        generateGoogleIcon: function () {
            var opts = this.toJSON();
            opts.anchor = new google.maps.Point(this.anchor[0], this.anchor[1]);
            opts.origin =  this.origin || new google.maps.Point(0, 0);
            return opts;
        },
        toJSON: function () {
            return {
                fillColor: this.fillColor,
                fillOpacity: this.fillOpacity,
                strokeColor: this.strokeColor,
                strokeWeight: this.strokeWeight,
                strokeOpacity: this.strokeOpacity,
                path: this.path,
                markerSize: this.width,
                scale: this.getScale(),
                url: this.url,
                //size: new google.maps.Size(this.width, this.height),
                viewBox: this.getViewBox(),
                width: this.width,
                height: this.height
            };
        }
    });
    return Icon;
});
