define(['underscore',
        'jquery',
        'color-picker',
        'text!/static/backbone/js/templates/infoBubble/markerAttachTip.html',
        'lib/maps/overlays/infobubbles/base',
        'slick'], function (_, $, jscolor, markerAttachTipTemplate, BaseBubble) {
    "use strict";
    /**
     * Class that controls marker point model overlays.
     * Extends @link {localground.maps.overlays.Point}.
     * @class Audio
     */
    var MarkerBubble = BaseBubble.extend({

        events: function () {
            return _.extend({}, BaseBubble.prototype.events, {
                'click .detach': 'detach'
            });
        },

        modelEvents: function () {
            return _.extend({}, BaseBubble.prototype.modelEvents, {
                'show-tip-attaching': 'showTipAttaching'
            });
        },

        renderViewContent: function () {
            BaseBubble.prototype.renderViewContent.apply(this, arguments);
            //controls marker slide show:
            var that = this;
            window.setTimeout(function () {
                $('.marker-container').slick({
                    dots: false
                });
                that.$el.find("button").click(function (e) {
                    that.sendToBack(e);
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

        showTipAttaching: function () {
            var template = _.template(markerAttachTipTemplate);
            this.tip.setContent(template(this.getContext()));
            this._show(this.tip);
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
    return MarkerBubble;
});
