define(['underscore',
    'jquery',
    'lib/maps/overlays/infobubbles/base'], function (_, $, BaseBubble) {
    "use strict";
    /**
     * Class that controls marker point model overlays.
     * Extends @link {localground.maps.overlays.Point}.
     * @class Audio
     */
    var AudioBubble = BaseBubble.extend({

        events: function () {
            return _.extend({}, BaseBubble.prototype.events, {
                "click .detach": "detach",
                'click .play-audio': 'playAudio',
                'click .stop-audio': 'stopAudio'
            });
        },

        playAudio: function (e) {
            this.app.vent.trigger('playAudio', this.model);
            e.stopPropagation();
        },

        stopAudio: function (e) {
            this.app.vent.trigger('stopAudio');
            e.stopPropagation();
        },

        renderViewContent: function () {
            BaseBubble.prototype.renderViewContent.apply(this, arguments);
        },

        renderEditContent: function () {
            BaseBubble.prototype.renderEditContent.apply(this, arguments);
        },
        showBubble: function () {
            var that = this;
            that.model.fetch({ success: function () {
                BaseBubble.prototype.showBubble.apply(that, arguments);
            }});
        },

        onBubbleRender: function () {
            this.delegateEvents();
        },

        detach: function (e) {
            var $a = $(e.currentTarget),
                key = $a.attr("key"),
                modelID = parseInt($a.attr("item-id"), 10),
                that = this;
            this.model.detach(modelID, key, function () {
                $a.parent().parent().remove();
                that.model.fetch();
            });
        }
    });
    return AudioBubble;
});