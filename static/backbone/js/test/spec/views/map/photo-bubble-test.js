define(["underscore",
        "lib/maps/overlays/photo",
        "config",
        "../../../../test/spec-helper"],
    function (_, PhotoOverlay, config) {
        'use strict';

        function initPhotoOverlay(scope) {
            scope.app.map = new google.maps.Map(document.getElementById('map_canvas'), {
                center: { lat: -34, lng: 150 }
            });

            //mock the getIcon method
            spyOn(PhotoOverlay.prototype, 'getIcon').and.callFake(function () {
                return {
                    path: google.maps.SymbolPath.CIRCLE
                };
            });
            return new PhotoOverlay({
                app: scope.app,
                model: scope.photos.models[0],
                infoBubbleTemplates: {
                    InfoBubbleTemplate: _.template(config.photos.InfoBubbleTemplate),
                    TipTemplate: _.template(config.photos.TipTemplate)
                }
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