var rootDir = "../../../";
define([
    rootDir + "apps/map/views/marker-listing-detail",
    rootDir + "lib/maps/overlays/icon",
    "tests/spec-helper"
],
    function (MarkerView, Icon) {
        'use strict';
        var markerView,
            icon,
            initSpies = function () {
                spyOn(MarkerView.prototype, 'initialize').and.callThrough();
                spyOn(MarkerView.prototype, 'restoreState');
            },
            initMarkerOverlay = function (that) {
                var model = that.markers.at(0);
                icon = new Icon({
                    shape: model.getDataTypePlural(),
                    fillColor: model.collection.fillColor,
                    width: model.collection.size,
                    height: model.collection.size
                });
                markerView = new MarkerView({
                    app: that.app,
                    icon: icon,
                    model: model,
                    displayOverlay: true
                });
            };


        describe("MarkerListingDetail: Initialization Tests w/o model", function () {
            beforeEach(function () {
                initSpies();
            });

            it("initializes startup params successfully successfully w/model", function () {
                initMarkerOverlay(this);
                expect(markerView.model).toBe(this.markers.at(0));
                expect(markerView.app).toBe(this.app);
                expect(markerView.icon).toBe(icon);
                expect(typeof markerView.fields).toBe('undefined');
                expect(markerView.displayOverlay).toBeTruthy();
            });
        });

    });
