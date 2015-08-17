define(["underscore",
        "jquery",
        "lib/maps/overlays/infobubbles/photo",
        "lib/maps/overlays/photo",
        "config",
        "../../../test/spec-helper"],
    function (_, $, PhotoBubble, PhotoOverlay, Config) {
        'use strict';

        function initPhotoOverlay(scope) {
                scope.app.setMap(new google.maps.Map('',{}));
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