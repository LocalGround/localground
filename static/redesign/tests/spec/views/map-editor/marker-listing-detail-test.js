var rootDir = "../../../";
define([
    rootDir + "apps/map/views/marker-listing-detail",
    rootDir + "lib/maps/overlays/icon",
    rootDir + "models/base",
    rootDir + "collections/basePageable",
    "tests/spec-helper"
],
    function (MarkerView, Icon, BaseModel, BaseCollection) {
        'use strict';
        var markerView,
            icon,
            model,
            i,
            models,
            counter = 0,
            initSpies = function () {
                //View Spies:
                spyOn(MarkerView.prototype, 'initialize').and.callThrough();
                spyOn(MarkerView.prototype, 'redrawVisible').and.callThrough();
                spyOn(MarkerView.prototype, 'redrawHidden').and.callThrough();
                spyOn(MarkerView.prototype, 'render').and.callThrough();
                spyOn(MarkerView.prototype, 'hoverHighlight').and.callThrough();
                spyOn(MarkerView.prototype, 'clearHoverHighlight').and.callThrough();

                //Model / Collection Spies:
                spyOn(BaseModel.prototype, 'trigger').and.callThrough();
                spyOn(BaseCollection.prototype, 'trigger').and.callThrough();

            },
            initGlobals = function (that) {
                models = [
                    that.markers.at(0),
                    that.form_1.at(0),
                    that.photos.at(0),
                    that.audioFiles.at(0),
                    that.map_images.at(0)
                ];
                model = models[counter];
            },
            getIcon = function () {
                icon = new Icon({
                    shape: model.getDataTypePlural(),
                    fillColor: model.collection.fillColor,
                    width: model.collection.size,
                    height: model.collection.size
                });
                return icon;
            },
            initMarkerView = function (that) {
                markerView = new MarkerView({
                    app: that.app,
                    icon: getIcon(),
                    model: model,
                    displayOverlay: true
                });
            },
            clearLocalStorage = function () {
                localStorage.mapplication = JSON.stringify({});
            };


        describe("MarkerListingDetail: Initialization Tests", function () {
            beforeEach(function () {
                initSpies();
                initGlobals(this);
            });

            // Note: this tests all 5 data types. All generic functionality to 
            // be tested across models should be done here:
            for (i = 0; i < 5; i++) {
                it("initializes startup params successfully", function () {
                    spyOn(MarkerView.prototype, 'restoreState');
                    initMarkerView(this);
                    expect(markerView.model).toBe(model);
                    expect(markerView.app).toBe(this.app);
                    expect(markerView.icon).toBe(icon);
                    expect(typeof markerView.fields).toBe('undefined');
                    expect(markerView.displayOverlay).toBeTruthy();
                    markerView.stateKey = model.get("overlay_type") + "-" + model.id;
                });

                it("initializes default params successfully", function () {
                    spyOn(MarkerView.prototype, 'restoreState');
                    markerView = new MarkerView({
                        app: this.app,
                        icon: icon,
                        model: model
                    });
                    expect(markerView.displayOverlay).toBeFalsy();
                });

                it("Restores overlay visibility state on initialization", function () {
                    clearLocalStorage();

                    //should initialize overlay turned on
                    initMarkerView(this);
                    expect(BaseModel.prototype.trigger).toHaveBeenCalledWith('show-marker');
                    expect(BaseModel.prototype.trigger).not.toHaveBeenCalledWith('hide-marker');
                    expect(BaseModel.prototype.trigger).toHaveBeenCalledTimes(1);

                    //turn off overlay and save state:
                    markerView.displayOverlay = false;
                    markerView.saveState();

                    //should initialize overlay turned off
                    initMarkerView(this);
                    expect(BaseModel.prototype.trigger).toHaveBeenCalledWith('hide-marker');
                    expect(BaseModel.prototype.trigger).toHaveBeenCalledTimes(2);
                });

                describe("Listens for model events", function () {
                    it("Listens for 'saved' event", function () {
                        initMarkerView(this);
                        expect(MarkerView.prototype.render).toHaveBeenCalledTimes(0);
                        model.trigger('saved');
                        expect(MarkerView.prototype.render).toHaveBeenCalledTimes(1);
                    });

                    it("Listens for 'do-hover' event", function () {
                        initMarkerView(this);
                        expect(MarkerView.prototype.hoverHighlight).toHaveBeenCalledTimes(0);
                        model.trigger('do-hover');
                        expect(MarkerView.prototype.hoverHighlight).toHaveBeenCalledTimes(1);
                    });

                    it("Listens for 'clear-hover' event", function () {
                        initMarkerView(this);
                        expect(MarkerView.prototype.clearHoverHighlight).toHaveBeenCalledTimes(0);
                        model.trigger('clear-hover');
                        expect(MarkerView.prototype.clearHoverHighlight).toHaveBeenCalledTimes(1);
                    });

                    it("Listens for 'change:active' event", function () {
                        initMarkerView(this);
                        expect(MarkerView.prototype.render).toHaveBeenCalledTimes(0);
                        model.trigger('change:active');
                        expect(MarkerView.prototype.render).toHaveBeenCalledTimes(1);
                    });

                    it("Listens for 'change:geometry' event", function () {
                        initMarkerView(this);
                        expect(MarkerView.prototype.render).toHaveBeenCalledTimes(0);
                        model.trigger('change:geometry');
                        expect(MarkerView.prototype.render).toHaveBeenCalledTimes(1);
                    });

                    it("Listens for 'show-marker' event", function () {
                        initMarkerView(this);
                        expect(MarkerView.prototype.redrawVisible).toHaveBeenCalledTimes(0);
                        model.trigger('show-marker');
                        expect(MarkerView.prototype.redrawVisible).toHaveBeenCalledTimes(1);
                    });
                });

                it("Listens for collection events", function () {
                    initMarkerView(this);
                    expect(MarkerView.prototype.redrawVisible).toHaveBeenCalledTimes(0);
                    model.trigger('show-markers');
                    expect(MarkerView.prototype.redrawVisible).toHaveBeenCalledTimes(1);
                    expect(MarkerView.prototype.redrawHidden).toHaveBeenCalledTimes(0);
                    model.trigger('hide-markers');
                    expect(MarkerView.prototype.redrawHidden).toHaveBeenCalledTimes(1);
                    ++counter;
                });

            }
        });

        describe("MarkerListingDetail: Renderer Tests", function () {
            beforeEach(function () {
                counter = 0;
                initSpies();
                initGlobals(this);
            });

            it("initializes startup params successfully", function () {
                spyOn(MarkerView.prototype, 'restoreState');
                initMarkerView(this);
                expect(markerView.model).toBe(model);
            });
        });

    });
