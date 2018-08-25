define(["underscore",
        "marionette",
        "handlebars"
    ],
    function (_, Marionette, Handlebars) {
        'use strict';
        var MapHeader = Marionette.ItemView.extend({

            template: Handlebars.compile(
                '<a href=""><h1 style="font-weight: {{ fontWeight }}; color: {{ fontColor }}; font-size: {{ fontSize }}; font-family: {{ fontFamily }};">\
                    {{ name }} \
                </h1> </a>\
                <h2>{{caption}}</h2> \
            '),

            initialize: function (opts) {
                _.extend(this, opts);
                this.render();
            },
            templateHelpers: function () {
                var styles = this.model.get("panel_styles"),
                    opts = {
                        fontFamily: styles.title.font,
                        fontSize: styles.title.size + "px",
                        fontColor: styles.title.color,
                        fontWeight: styles.title.fw
                    };
                return opts;
            },
            onRender: function () {
                this.$el.css({
                    backgroundColor: '#' + this.model.get("panel_styles").title.backgroundColor
                });
            }
        });
        return MapHeader;
    });