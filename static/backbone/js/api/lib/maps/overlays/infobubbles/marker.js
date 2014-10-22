define(['jquery',
        'color-picker',
        'lib/maps/overlays/infobubbles/base'], function ($, jscolor, BaseBubble) {
    "use strict";
    /**
     * Class that controls marker point model overlays.
     * Extends @link {localground.maps.overlays.Point}.
     * @class Audio
     */
    var MarkerBubble = BaseBubble.extend({

        renderViewContent: function () {
            BaseBubble.prototype.renderViewContent.apply(this, arguments);

            //controls marker slide show:
            window.setTimeout(function () {
                $('.marker-container').slick({
                    dots: false
                });
            }, 200);
        },

        renderEditContent: function () {
            BaseBubble.prototype.renderEditContent.apply(this, arguments);
            this.initColorPicker();
        },

        initColorPicker: function () {
            var colorInput = this.$el.find('.form').find('[name="color"]'),
                picker;
            if (colorInput.get(0) != null) {
                picker = new jscolor.color(colorInput.get(0), {});
                picker.fromString("#" + this.model.get("color"));
            }
        }
    });
    return MarkerBubble;
});
