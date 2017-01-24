define(["marionette",
        "handlebars",
        "collections/maps",
        "text!../../templates/left/select-map.html"
    ],
    function (Marionette, Handlebars, Maps, MapTemplate) {
        'use strict';

        var SelectMapView = Marionette.ItemView.extend({

            template: Handlebars.compile(MapTemplate),
            
            events: {
                'change #map-select': 'changeMap' 
            },

            initialize: function (opts) {
                this.app = opts.app;

                // here is some fake data until the
                // /api/0/maps/ API Endpoint gets built:
                this.collection = new Maps([
                    { id: 1, name: "Flowers & Birds", project_id: 4 },
                    { id: 2, name: "Berkeley Public Art", project_id: 4 },
                    { id: 3, name: "Soil Science", project_id: 4 }                ]);
                
             //   var $bselected = this.$el.val($("#map-select").find('option:selected').val());
                var $selected = this.$el.find("#map-select").val();
                console.log($selected);
                this.app.currentMap = this.collection.at(0);
                this.app.vent.trigger("change-map", this.app.currentMap);
                this.app.vent.trigger("init-collection", this.collection.get($selected));
            },
            
            changeMap: function(e) {
                var $select = $(e.target);
                var id = $select.val();
                console.log($select.val());
                console.log("map change");
                                                                                           
                this.app.vent.trigger("change-map", this.collection.get(id));
            }

        });
        return SelectMapView;
    });