define(["marionette", "underscore", "jquery"],
    function (Marionette, _, $) {
        "use strict";

        var TileController = Marionette.ItemView.extend({
            /**
             * Raw data array of map overlays, pulled from the Local Ground Data API.
             * @see <a href="//localground.org/api/0/tiles">Local Ground Data API</a>.
             */
            initialize: function (opts) {
                var key, that = this;
                _.extend(this, opts);
                this.tilesets = this.app.dataManager.tilesets;
                this.map = this.app.map;
                for (key in this.tilesets.mapTypes) {
                    this.map.mapTypes.set(key, this.tilesets.mapTypes[key]);
                }
                this.setActiveMapType(this.activeMapTypeID);
                setTimeout(function () {
                    that.showCustomAttribution(that.activeMapTypeID);
                }, 500);
                this.app.vent.on('map-tiles-changed', this.showCustomAttribution.bind(this));
            },
            getTileSetByKey: function (key, value) {
                return this.tilesets.find(function (model) {
                    if (key === 'name') {
                        return model.get(key).toLowerCase() === value.toLowerCase();
                    }
                    return model.get(key) === value;
                });
            },
            getMapTypeId: function () {
                var tileset = this.getTileSetByKey("name", this.map.getMapTypeId().toLowerCase());
                if (!tileset) {
                    return null;
                }
                return tileset.id;
            },
            hideCustomAttribution: function () {
                $('.tile-attribution').parent().prev().show();
                $('.tile-attribution').remove();
            },
            showCustomAttribution: function (id) {
                this.hideCustomAttribution();
                id = id || this.getMapTypeId();
                var tileset = this.tilesets.get(id),
                    $message;
                if (!tileset.get("attribution")) {
                    return;
                }
                $message = $('<span class="tile-attribution"></span>').html(tileset.get("attribution"));
                $('.gm-style-cc span').parent().append($message);
                $message.css({
                    marginLeft: ($message.width() - 6) * -1,
                    backgroundColor: "rgba(255, 255, 255, 0.7)"
                });
                $message.parent().prev().hide();
            },
            setActiveMapType: function (id) {
                this.showCustomAttribution(id);
                var tileset = this.getTileSetByKey("id", id);
                if (tileset) {
                    this.map.setMapTypeId(tileset.getMapTypeID());
                    this.app.vent.trigger("map-tiles-changed");
                }
            }
        });


        return TileController;
    });
