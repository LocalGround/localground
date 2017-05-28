define(["jquery",
        "marionette",
        "underscore",
        "handlebars",
        "text!../templates/list-detail.html"],
    function ($, Marionette, _, Handlebars, ItemTemplate) {
        'use strict';
        var MarkerListingDetail = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.model.set("dataType", this.dataType);
                this.listenTo(this.model, 'do-hover', this.hoverHighlight);
                this.listenTo(this.model, 'clear-hover', this.clearHoverHighlight);
            },
            template: Handlebars.compile(ItemTemplate),
            modelEvents: {
                'saved': 'render',
                'change:active': 'render',
                'change:geometry': 'render'
            },
            tagName: "li",
            templateHelpers: function () {
                var opts = {
                    dataType: this.dataType,
                    icon: this.icon,
                    name: this.model.get("name") || this.model.get("display_name")  || this.model.get("title"),
                    displayOverlays: this.displayOverlays
                };
                if (this.icon) {
                    _.extend(opts, {
                        width: 15 * this.icon.getScale(),
                        height: 15 * this.icon.getScale()
                    });
                }
                return opts;
            },
            hoverHighlight: function () {
                this.clearHoverHighlight();
                if (!this.$el.hasClass('highlight')) {
                    this.$el.addClass("hover-highlight");
                }
            },
            clearHoverHighlight: function () {
                $("li").removeClass("hover-highlight");
            }
        });
        return MarkerListingDetail;
    });