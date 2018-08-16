define(["jquery",
        "marionette",
        "underscore",
        "handlebars",
        "text!../templates/list-detail.html",
        "text!../templates/list-detail-map-image.html"],
    function ($, Marionette, _, Handlebars, DefaultTemplate, MapImageTemplate) {
        'use strict';
        var MarkerListingDetail = Marionette.ItemView.extend({
            //displayOverlay: false,
            initialize: function (opts) {
                /* --------------------------
                 * Initialization Parameters:
                 * --------------------------
                 * 1. app
                 * 2. icon
                 * 3. model
                 * 4. displayOverlay (optional; defaults to false)
                */
                _.extend(this, opts);

                //add event listeners:
                this.listenTo(this.model.collection, 'show-markers', this.render);
                this.listenTo(this.model.collection, 'hide-markers', this.render);
                if(this.parent.displayOverlays) {
                    this.model.trigger('show-marker');
                } else {
                    this.model.trigger('hide-marker');
                }
            },
            getTemplate: function () {
                if (this.model.get("overlay_type") === "map-image") {
                    return Handlebars.compile(MapImageTemplate);
                }
                return Handlebars.compile(DefaultTemplate);
            },
            modelEvents: {
                'saved': 'render',
                'do-hover': 'hoverHighlight',
                'clear-hover': 'clearHoverHighlight',
                'change:active': 'render',
                'change:geometry': 'render'
            },
            tagName: "li",
            templateHelpers: function () {
                var opts = {
                    dataType: this.model.getDataTypePlural(),
                    screenType: this.app.screenType,
                    icon: this.icon,
                    name: this.model.get("name") || this.model.get("display_name"),
                    displayOverlay: this.parent.displayOverlays,
                    isPoint: this.geometryType() === "Point",
                    isPolygon: this.geometryType() === "Polygon",
                    isPolyline: this.geometryType() === "LineString"
                };
                if (this.icon) {
                    _.extend(opts, {
                        width: 15 * this.icon.getScale(),
                        height: 15 * this.icon.getScale()
                    });
                }
                return opts;
            },

            geometryType: function() {
                // don't check 'geometry.type' is 'geometry' is nullthis.geometryType === "Point",
                if (this.model.get('geometry')) {
                    return this.model.get('geometry').type;
                }
            },

            hoverHighlight: function () {
                this.clearHoverHighlight();
                if (!this.$el.find('a').hasClass('highlight')) {
                    this.$el.addClass("hover-highlight");
                }
            },
            clearHoverHighlight: function () {
                $("li").removeClass("hover-highlight");
            }
        });
        return MarkerListingDetail;
    });
