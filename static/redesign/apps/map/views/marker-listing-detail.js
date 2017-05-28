define(["jquery",
        "marionette",
        "underscore",
        "handlebars",
        "text!../templates/list-detail.html",
        "text!../templates/list-detail-map-image.html"],
    function ($, Marionette, _, Handlebars, DefaultTemplate, MapImageTemplate) {
        'use strict';
        var MarkerListingDetail = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.model.set("dataType", this.dataType);
                this.listenTo(this.model, 'do-hover', this.hoverHighlight);
                this.listenTo(this.model, 'clear-hover', this.clearHoverHighlight);
            },
            getTemplate: function () {
                if (this.model.get("overlay_type") === "map-image") {
                    return Handlebars.compile(MapImageTemplate);
                }
                return Handlebars.compile(DefaultTemplate);
            },
            events: {
                'click .fa-eye': 'hideMarker',
                'click .fa-eye-slash': 'showMarker'
            },
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
                    displayOverlay: this.displayOverlay
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
            },
            hideMarker: function (e) {
                this.displayOverlay = false;
                this.model.trigger('hide-overlay');
                this.render();
                e.preventDefault();
            },
            showMarker: function (e) {
                this.displayOverlay = true;
                this.model.trigger('show-overlay');
                this.render();
                e.preventDefault();
            }
        });
        return MarkerListingDetail;
    });