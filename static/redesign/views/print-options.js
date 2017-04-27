define(["jquery",
        "marionette",
        "handlebars",
        "lib/modals/modal",
        "lib/maps/basemap",
        "models/print",
        "views/generate-print",
        "text!../templates/print-options.html"
    ],
    function ($, Marionette, Handlebars, Modal,
              BaseMap, Print, GeneratePrint, PrintOptionsTemplate) {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var PrintOptions = Marionette.ItemView.extend({
            template: Handlebars.compile(PrintOptionsTemplate),

            basemapView: null,

            initialize: function (opts) {
                /*This Layout View relies on a Map model which gets set from the change-map event,
                which is triggered from the select-map-view.js */
                this.app = opts.app;
                this.model = new Print();
                this.render();
                this.basemapView = this.app.basemapView; // Let's try this for now....
                //this.showBasemap();
                console.log(this.app);
            },

            detectLayout: function(){

                var layoutVal = 0;
                var option_layout = this.$el.find(".option-layout").prop("checked");
                var option_data = this.$el.find(".option-data").prop("checked");
                var option_layout_val = this.$el.find(".option-layout:checked").val();
                var option_data_val = this.$el.find(".option-data:checked").val();

                if (option_data_val == "Yes"){
                    layoutVal += 0;
                } else if (option_data_val == "No"){
                    layoutVal += 2;
                }

                if (option_layout_val == "Portrait"){
                    layoutVal += 0;
                } else if (option_layout_val == "Landscape"){
                    layoutVal += 1;
                }

                layoutVal += 1;

                return layoutVal;


            },

            makePrint: function(){
                alert("Call Generate Print");
                // Todo: Make the new map based on the current data stored on the map.
                //basemapView.setZoom();
                //basemapView.setCenter();
                //basemapView.setMapTypeId();

                // Let's test this rough draft
                // Will be tweaked later
                var printMap = new Print();
                var that = this;
                printMap.set("project_id", this.app.getProjectID());
                printMap.set("layout", this.detectLayout()); // replace with modular setting soon
                printMap.set("center", this.basemapView.getCenter());
                printMap.set("zoom", this.basemapView.getZoom());
                printMap.set("map_provider", this.basemapView.getMapTypeId());
                printMap.set("map_title", this.$el.find("#print-title").val());
                printMap.set("instructions", this.$el.find("#print-instructions").val());
                console.log(printMap);
                this.$el.find(".loading").show();
                printMap.save(null, {
                    success: function(){
                        console.log("Map Saved");
                        that.$el.find(".loading").hide();

                    },
                    error: function(){
                        console.log("Map Not Saved");
                    }
                });

            }


        });
        return PrintOptions;
});
