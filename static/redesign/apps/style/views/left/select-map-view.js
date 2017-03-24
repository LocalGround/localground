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

                this.collection = opts.collection;
                if (!this.collection) {
                    // /api/0/maps/ API Endpoint gets built:
                    this.collection = new Maps();
                    this.collection.setServerQuery("WHERE project = " + this.app.getProjectID());
                    this.collection.fetch({reset: true});
                }
                
                var $selected = this.$el.find("#map-select").val();
                this.listenTo(this.collection, 'reset', this.drawOnce);
                this.app.currentMap = this.collection.at(0);
            },

            drawOnce: function () {
                this.render();
                var $selected = this.$el.find("#map-select").val();
                var selectedMapModel = this.collection.get($selected);


                this.setCenterZoom(selectedMapModel);
                this.setMapTypeId(selectedMapModel);
                this.app.vent.trigger("change-map", selectedMapModel);
            },

            changeMap: function(e) {
                var id = $(e.target).val();
                var selectedMapModel = this.collection.get(id);

                this.setCenterZoom(selectedMapModel);
                this.setMapTypeId(selectedMapModel);
                this.app.vent.trigger("change-map", selectedMapModel);
            },

            setCenterZoom: function (selectedMapModel) {
                var location = selectedMapModel.getDefaultLocation();
                this.app.basemapView.setCenter(location.center);
                this.app.basemapView.setZoom(location.zoom);
            },

            setMapTypeId: function (selectedMapModel) {
                var skin = selectedMapModel.getDefaultSkin();
                this.app.basemapView.setMapTypeId(skin.basemap);
            }

        });
        return SelectMapView;
    });
