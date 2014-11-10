/**
 * Created by zmmachar on 11/3/14.
 */
define([
    "underscore",
    "views/maps/sidepanel/items/item"
], function (_, Item) {
    "use strict";
    /**
     * Class that controls photo Models. Extend the
     * {@link localground.maps.views.Item} class.
     * @class MarkerItem
     */
    var AudioItem = Item.extend({
        events: _.extend(Item.prototype.events, {
            'click .play-audio': 'playAudio',
            'click .stop-audio': 'stopAudio'
        }),

        playAudio: function (e) {
            this.app.vent.trigger('playAudio', this.model);
            e.stopPropagation();
        },

        stopAudio: function (e) {
            this.app.vent.trigger('stopAudio');
            e.stopPropagation();
        }
    });
    return AudioItem;
});