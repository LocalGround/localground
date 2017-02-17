define(["marionette",
        "underscore",
        "handlebars",
        "apps/presentation/views/legend-layer-entry"
    ],
    function (Marionette, _, Handlebars, LayerEntryView) {
        'use strict';
        var LayerListManager = Marionette.CompositeView.extend({
            tagName: 'div',
            template: Handlebars.compile(''),
            initialize: function (opts) {
                _.extend(this, opts);
            },
            childViewOptions: function () {
                return {
                    app: this.app
                };
            },
            childView: LayerEntryView
        });
        return LayerListManager;

    });