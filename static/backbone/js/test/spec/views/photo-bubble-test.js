define(["underscore",
        "jquery",
        "views/maps/basemap",
        "lib/maps/overlays/infobubbles/photo",
        "lib/maps/overlays/photo",
        "config",
        "../../../test/spec-helper"],
    function (_, $, Basemap, PhotoBubble, PhotoOverlay, Config) {
        'use strict';

        function initPhotoOverlay(scope) {
            var opts = _.clone(scope.mapEditorInitializationParams);
            opts = _.extend(opts, { app: scope.app });
            var basemap = new Basemap(opts);
            scope.app.setMap(basemap.map);
            //mock the getIcon method
            spyOn(PhotoOverlay.prototype,'getIcon').and.callFake(function() {
                return {
                    path: google.maps.SymbolPath.CIRCLE
                }
            });
            return new PhotoOverlay({
                app: scope.app,
                model: scope.photos.models[0],
                infoBubbleTemplates: {
                    InfoBubbleTemplate: _.template(Config['photos'].InfoBubbleTemplate),
                    TipTemplate: _.template(Config['photos'].TipTemplate)
                },
                
            });
        }

        describe("PhotoBubble", function () {
            var photoOverlay;

            it("Shows photo in edit mode", function () {
                photoOverlay = initPhotoOverlay(this);
                this.app.setMode('edit');
                photoOverlay.showBubble();
                expect(photoOverlay.infoBubble.$el.find('.edit-photo-container > img')[0].outerHTML).toEqual('<img src="//:0">');
            });


        }); 


    });