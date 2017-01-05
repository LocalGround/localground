define(['underscore',
    'jquery',
    'lib/maps/overlays/infobubbles/base'], function (_, $, BaseBubble) {
    "use strict";
    /**
     * Class that controls marker point model overlays.
     * Extends @link {localground.maps.overlays.Point}.
     * @class Audio
     */
    var PhotoBubble = BaseBubble.extend({

        events: function () {
            return _.extend({}, BaseBubble.prototype.events, {
                "click .rotate-link": "rotate"
            });
        },
        rotate: function (e) {
            var direction = e.target.dataset.direction;
            this.model.rotate(direction);
        }
    });
    return PhotoBubble;
});