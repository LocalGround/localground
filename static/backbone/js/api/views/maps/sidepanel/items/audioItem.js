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

        initialize: function () {
            Item.prototype.initialize.apply(this,arguments);
            this.listenTo(this.model, 'play', this.indicatePlay);
            this.listenTo(this.model, 'stop', this.indicateStop);
        },

        playAudio: function (e) {
            this.app.vent.trigger('playAudio', this.model);
            e.stopPropagation();
        },

        stopAudio: function (e) {
            this.app.vent.trigger('stopAudio');
            e.stopPropagation();
        },
        indicatePlay: function () {
            this.$el.find('.play-audio').addClass('playing');
        },
        indicateStop: function () {
            this.$el.find('.play-audio').removeClass('playing');
        }
    });
    return AudioItem;
});