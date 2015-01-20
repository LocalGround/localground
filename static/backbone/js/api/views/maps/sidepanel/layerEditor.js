define(["underscore",
        "jquery",
        "marionette",
        "text!" + templateDir + "/sidepanel/layerEditor.html"
        ],
    function (_, $, Marionette, LayerEditorTemplate) {
        'use strict';

        var LayerEditor = Marionette.View.extend({

            events: {
                'click #marker_cancel': 'hide'
            },

            template: _.template(LayerEditorTemplate),

            initialize: function (opts) {
                $.extend(this, opts);
            },

            render: function () {
                this.$el.html(this.template());
            },

            ignore: function (e) {
                e.stopPropagation();
            },

            hide: function () {
                this.app.vent.trigger('show-layer-list');
            },

            show: function () {
                this.$el.show();
            }
        });
        return LayerEditor;
    });
