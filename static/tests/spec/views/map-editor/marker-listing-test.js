var rootDir = "../../../";
define([
    rootDir + "apps/dataviewer/map/views/marker-listing",
    rootDir + "lib/maps/overlays/icon",
    rootDir + "lib/maps/overlays/infobubbles/base",
    rootDir + "models/base",
    rootDir + "collections/basePageable",
    "tests/spec-helper"
],
    function (MarkerListing, Icon, InfoBubble, BaseModel, BaseCollection) {
        'use strict';
        var markerListing,
            icon,
            fixture,
            dataEntry,
            i,
            dataEntries,
            entryCounter = 0,
            initSpies = function () {
                //View Spies:
                spyOn(InfoBubble.prototype, 'initialize'); //don't call through
                spyOn(MarkerListing.prototype, 'initialize').and.callThrough();
                spyOn(MarkerListing.prototype, 'render').and.callThrough();
                spyOn(MarkerListing.prototype, 'saveState').and.callThrough();
                spyOn(MarkerListing.prototype, 'restoreState').and.callThrough();

                //Model / Collection Spies:
                spyOn(BaseCollection.prototype, 'trigger').and.callThrough();
                spyOn(BaseModel.prototype, 'trigger').and.callThrough();

            },
            initGlobals = function (that) {
                dataEntries = [
                    { collection: that.markers },
                    { collection: that.form_1 },
                    { collection: that.photos },
                    { collection: that.audioFiles },
                    { collection: that.map_images }
                ];
                dataEntry = dataEntries[entryCounter];
            },
            getIcon = function () {
                var collection = dataEntry.collection;
                icon = new Icon({
                    shape: collection.getDataType(),
                    fillColor: collection.fillColor,
                    width: collection.size,
                    height: collection.size
                });
                return icon;
            },
            initMarkerListing = function (that) {
                markerListing = new MarkerListing({
                    app: that.app,
                    icon: getIcon(),
                    fields: dataEntry.fields,
                    collection: dataEntry.collection
                });
            },
            clearMarkerListingsFromLocalStorage = function () {
                var key,
                    cache = JSON.parse(localStorage.mapplication);
                for (key in cache) {
                    if (key.indexOf("marker") != -1) {
                        delete cache[key];
                    }
                }
                localStorage.mapplication = JSON.stringify(cache);
            };


        describe("MarkerListing: Initialization Tests", function () {
            beforeEach(function () {
                initSpies();
                initGlobals(this);
            });

            it("initializes startup params successfully", function () {
                initMarkerListing(this);
                expect(markerListing.collection).toBe(dataEntry.collection);
                expect(markerListing.fields).toBe(dataEntry.fields);
                expect(markerListing.app).toBe(this.app);
                expect(markerListing.icon.toJSON()).toEqual(icon.toJSON());
                expect(markerListing.displayOverlays).toBeTruthy();
                markerListing.stateKey = 'marker-listing-' + dataEntry.collection.getDataType();
            });
        });
    });
