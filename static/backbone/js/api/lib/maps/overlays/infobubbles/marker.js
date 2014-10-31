define(['underscore',
        'jquery',
        'color-picker',
        'lib/maps/overlays/infobubbles/base',
        'slick'], function (_, $, jscolor, BaseBubble) {
    "use strict";
    /**
     * Class that controls marker point model overlays.
     * Extends @link {localground.maps.overlays.Point}.
     * @class Audio
     */
    var MarkerBubble = BaseBubble.extend({

        events: function () {
            return _.extend({}, BaseBubble.prototype.events, {
                "click .detach": "detach"
            });
        },

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
        },
        showBubble: function () {
            var that = this;
            that.model.fetch({ success: function () {
                BaseBubble.prototype.showBubble.apply(that, arguments);
            }});
        },

        detach: function (e) {
            var $a = $(e.currentTarget),
                key = $a.attr("key"),
                modelID = parseInt($a.attr("item-id")),
                that = this;
            this.model.detach(modelID, key, function () {
				$a.parent().parent().remove();
				that.model.fetch();
            });
        }
    });
    return MarkerBubble;
});
