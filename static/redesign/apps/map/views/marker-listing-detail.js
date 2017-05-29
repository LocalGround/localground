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
            displayOverlay: true,
            initialize: function (opts) {
                console.log(opts);
                _.extend(this, opts);
                this.stateKey += this.model.get("overlay_type") + "-" + this.model.id;
                console.log(this.stateKey, this.displayOverlay);
                this.restoreState();
                this.model.set("dataType", this.dataType);
                console.log(this.stateKey, this.displayOverlay);

                //add event listeners:
                this.listenTo(this.model, 'do-hover', this.hoverHighlight);
                this.listenTo(this.model, 'clear-hover', this.clearHoverHighlight);
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
                this.saveState();
                e.preventDefault();
            },
            showMarker: function (e) {
                this.displayOverlay = true;
                this.model.trigger('show-overlay');
                this.render();
                this.saveState();
                e.preventDefault();
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
                    this.model.trigger('show-overlay');
                }
            }
        });
        return MarkerListingDetail;
    });