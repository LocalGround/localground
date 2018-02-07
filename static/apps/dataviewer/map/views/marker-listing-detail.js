define(["jquery",
        "marionette",
        "underscore",
        "handlebars",
        "text!../templates/list-detail.html",
        "text!../templates/list-detail-map-image.html"],
    function ($, Marionette, _, Handlebars, DefaultTemplate, MapImageTemplate) {
        'use strict';
        var MarkerListingDetail = Marionette.ItemView.extend({
            stateKey: 'marker-listing-',
            displayOverlay: false,
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
                this.stateKey = this.app.selectedProjectID + '-marker-listing-' +
                    this.model.get("overlay_type") + "-" + this.model.id;
                this.restoreState();

                //add event listeners:
                this.listenTo(this.model.collection, 'show-markers', this.redrawVisible);
                this.listenTo(this.model.collection, 'hide-markers', this.redrawHidden);
            },
            getTemplate: function () {
                if (this.model.get("overlay_type") === "map-image") {
                    return Handlebars.compile(MapImageTemplate);
                }
                return Handlebars.compile(DefaultTemplate);
            },
            events: {
                'click a .fa-eye': 'hideMarker',
                'click a .fa-eye-slash': 'showMarker'
            },
            modelEvents: {
                'saved': 'render',
                'change:id': 'saveStateAndRender',
                'do-hover': 'hoverHighlight',
                'clear-hover': 'clearHoverHighlight',
                'change:active': 'render',
                'change:geometry': 'render',
                'show-marker': 'redrawVisible',
                'hide-marker': 'redrawHidden'
            },
            tagName: "li",
            saveStateAndRender: function () {
                //reset state key:
                this.stateKey = 'marker-listing-' + this.model.get("overlay_type") + "-" + this.model.id;
                this.saveState();
                this.render();
            },
            templateHelpers: function () {
                var opts = {
                    dataType: this.model.getDataTypePlural(),
                    screenType: this.app.screenType,
                    icon: this.icon,
                    name: this.model.get("name") || this.model.get("display_name"),
                    displayOverlay: this.displayOverlay,
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
            },
            hideMarker: function (e) {
                this.displayOverlay = false;
                this.model.trigger('hide-marker');
                if (e) {
                    e.preventDefault();
                }
            },
            showMarker: function (e) {
                this.displayOverlay = true;
                this.model.trigger('show-marker');
                if (e) {
                    e.preventDefault();
                }
            },
            redrawVisible: function () {
                this.displayOverlay = true;
                this.saveState();
                this.render();
            },
            redrawHidden: function () {
                this.displayOverlay = false;
                this.saveState();
                this.render();
            },
            saveState: function () {
                this.app.saveState(this.stateKey, {
                    displayOverlay: this.displayOverlay
                });
            },
            restoreState: function () {
                var state = this.app.restoreState(this.stateKey);
                if (state && typeof state.displayOverlay !== 'undefined') {
                    this.displayOverlay = state.displayOverlay;
                }
                if (this.displayOverlay) {
                    this.model.trigger('show-marker');
                } else {
                   this.model.trigger('hide-marker');
                }
                //console.log("restoring: ", this.model.get("name"), this.displayOverlay);
                //console.log("restoring: ", state);
                //this.saveState();
            }
        });
        return MarkerListingDetail;
    });
