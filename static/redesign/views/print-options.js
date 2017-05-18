define(["underscore",
        "marionette",
        "handlebars",
        "models/print",
        "text!../templates/print-options.html"
    ],
    function (_, Marionette, Handlebars, Print, PrintOptionsTemplate) {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var PrintOptions = Marionette.ItemView.extend({
            template: Handlebars.compile(PrintOptionsTemplate),

            parent: null,
            pdf: null,
            thumb: null,

            initialize: function (opts) {
                /*This Layout View relies on a Map model which gets set from the change-map event,
                which is triggered from the select-map-view.js */
                _.extend(this, opts);
                this.render();
            },

            templateHelpers: function () {
                return {
                    pdf: this.pdf,
                    thumb: this.thumb
                };
            },

            detectLayout: function () {
                var option_layout_val = this.$el.find(".option-layout:checked").val(),
                    option_data_val = this.$el.find(".option-data:checked").val(),
                    layoutVal = 1;

                if (option_layout_val === "Landscape") {
                    layoutVal += 1;
                }
                if (option_data_val === "No") {
                    layoutVal += 2;
                }
                console.log(layoutVal);
                return layoutVal;
            },

            makePrint: function () {
                var printMap = this.model = new Print(),
                    that = this;
                this.basemapView = this.parent.basemapView;
                printMap.center = this.basemapView.getCenter();
                printMap.set("zoom", this.basemapView.getZoom());
                printMap.set("project_id", this.app.getProjectID());
                printMap.set("layout", this.detectLayout());
                printMap.set("map_provider", this.basemapView.getMapTypeId());
                printMap.set("map_title", this.$el.find("#print-title").val());
                printMap.set("instructions", this.$el.find("#print-instructions").val());
                //console.log(printMap);
                //this.$el.find(".load-message").show();
                this.app.vent.trigger("show-print-generate-message");
                printMap.save(null, {
                    success: function (model, response) {
                        //show the user the PDF and the thumbnail
                        console.log(response);
                        //that.$el.find(".load-message").hide();
                        that.app.vent.trigger("hide-print-generate-message");
                        that.pdf = response.pdf;
                        that.thumb = response.thumb;
                        that.render();

                    },
                    error: function (model, response) {
                        //show the user the PDF and the thumbnail
                        console.log(response);
                    }
                });

            }


        });
        return PrintOptions;
    });
