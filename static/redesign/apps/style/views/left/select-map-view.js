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
                this.collection = new Maps();
                this.collection.fetch({reset: true});
                
             //   var $bselected = this.$el.val($("#map-select").find('option:selected').val());
                var $selected = this.$el.find("#map-select").val();
                console.log($selected);
                this.listenTo(this.collection, 'reset', this.drawOnce);
                this.app.currentMap = this.collection.at(0);
                this.app.vent.trigger("change-map", this.app.currentMap);
                this.app.vent.trigger("init-collection", this.collection.get($selected));
            },
            
            drawOnce: function () {
                
                this.app.currentMap = this.collection.at(0);
                this.render();
                var $selected = this.$el.find("#map-select").val();
                console.log($selected, this.collection);
                this.app.vent.trigger("change-map", this.collection.get($selected));
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