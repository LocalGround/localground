define(['underscore',
    'jquery',
    'lib/maps/overlays/infobubbles/base'], function (_, $, BaseBubble) {
    "use strict";
    /**
     * Class that controls marker point model overlays.
     * Extends @link {localground.maps.overlays.Point}.
     * @class Audio
     */
    var SymbolizedBubble = BaseBubble.extend({
        //same as base, but don't trigger show-tip:
        modelEvents: {
            'show-bubble': 'showBubble',
            'hide-bubble': 'hideBubble',
            'hide-tip': 'hideTip'
        }
    });
    return SymbolizedBubble;
});