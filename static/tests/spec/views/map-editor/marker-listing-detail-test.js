var rootDir = "../../../";
define([
    "jquery",
    rootDir + "apps/dataviewer/map/views/marker-listing-detail",
    rootDir + "lib/maps/overlays/icon",
    rootDir + "models/base",
    rootDir + "collections/basePageable",
    "tests/spec-helper"
],
    function ($, MarkerView, Icon, BaseModel, BaseCollection) {
        'use strict';
        var markerView,
            icon,
            fixture,
            model,
            i,
            models,
            modelCounter = 0,
            initSpies = function () {
                //View Spies:
                spyOn(MarkerView.prototype, 'initialize').and.callThrough();
                spyOn(MarkerView.prototype, 'redrawVisible').and.callThrough();
                spyOn(MarkerView.prototype, 'redrawHidden').and.callThrough();
                spyOn(MarkerView.prototype, 'render').and.callThrough();
                spyOn(MarkerView.prototype, 'hoverHighlight').and.callThrough();
                spyOn(MarkerView.prototype, 'clearHoverHighlight').and.callThrough();
                spyOn(MarkerView.prototype, 'showMarker').and.callThrough();
                spyOn(MarkerView.prototype, 'hideMarker').and.callThrough();

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
                model = models[modelCounter];
            },
            getIcon = function () {
                icon = new Icon({
                    shape: model.collection.getDataType(),
                    fillColor: model.collection.fillColor,
                    width: model.collection.size,
                    height: model.collection.size
                });
                return icon;
            },
            initMarkerView = function (that) {
                that.app.screenType = "map";
                markerView = new MarkerView({
                    app: that.app,
                    icon: getIcon(),
                    model: model,
                    displayOverlay: true
                });
            },
            clearMarkerEntriesFromLocalStorage = function () {
                var key,
                    cache = JSON.parse(localStorage.mapplication);
                for (key in cache) {
                    if (key.indexOf("marker") != -1) {
                        delete cache[key];
                    }
                }
                localStorage.mapplication = JSON.stringify(cache);
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
                    clearMarkerEntriesFromLocalStorage();

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
                });

                it("initializes startup params successfully", function () {
                    clearMarkerEntriesFromLocalStorage();
                    initMarkerView(this);
                    markerView.render();
                    fixture = setFixtures('<div></div>').append(markerView.$el);

                    var $a = fixture.find("a"),
                        $svg = fixture.find("svg"),
                        $path = fixture.find("path"),
                        $p = fixture.find("p"),
                        $i = fixture.find("i");
                    expect(MarkerView.prototype.render).toHaveBeenCalledTimes(1);
                    expect(fixture).toContainElement("a");
                    expect(fixture.find("a")).toContainElement("p");
                    expect(fixture.find("a")).toContainElement("i");
                    expect($a.attr("href")).toEqual("#/" + this.app.screenType + "/" + model.getDataTypePlural() + "/" + model.id);

                    //ensure that the icon (svg) has been drawn correctly:
                    if (model.get("overlay_type") !== "map-image") {
                        expect(fixture.find("a")).toContainElement("svg");
                        expect($svg[0].getAttribute("viewBox")).toEqual(icon.getViewBox());
                        expect($svg.attr("width")).toEqual(icon.width.toString());
                        expect($svg.attr("height")).toEqual(icon.height.toString());
                        expect($path.attr("fill")).toEqual(icon.fillColor);
                        expect($path.attr("stroke")).toEqual("#FFFFFF");
                        expect($path.attr("stroke-width")).toEqual("2");
                        expect($path.attr("d")).toEqual(icon.path);
                        expect($path.attr("stroke-linejoin")).toEqual("round");
                        expect($path.attr("stroke-linecap")).toEqual("round");
                        expect($path.attr("paint-order")).toEqual("stroke");
                    } else {
                        // no SVGs for Map Overlays:
                        expect(fixture.find("a")).not.toContainElement("svg");
                    }

                    //ensure that paragraph has been rendered correctly:
                    expect($p).toHaveText(model.get("name") || model.get("display_name"));

                    //ensure that eye is showing on initialization:
                    expect($i.hasClass("toggle-visibility")).toBeTruthy();
                    expect($i.hasClass("fa-eye")).toBeTruthy();
                    expect($i.hasClass("fa-eye-slash")).toBeFalsy();

                    //important: increments the model modelCounter for the whole block:
                    ++modelCounter;
                });
            }
        });

        describe("MarkerListingDetail: UI Tests", function () {
            beforeEach(function () {
                modelCounter = 0;
                initSpies();
                spyOn(MarkerView.prototype, 'saveState').and.callThrough();
                spyOn(MarkerView.prototype, 'restoreState').and.callThrough();
                initGlobals(this);
                clearMarkerEntriesFromLocalStorage();
                initMarkerView(this);
                markerView.render();
                fixture = setFixtures($('<ul></ul>').append(markerView.$el));
            });

            it("listens for show / hide marker requests", function () {
                expect(MarkerView.prototype.showMarker).toHaveBeenCalledTimes(0);
                expect(MarkerView.prototype.hideMarker).toHaveBeenCalledTimes(0);
                expect(MarkerView.prototype.render).toHaveBeenCalledTimes(1);

                //click hide marker icon:
                fixture.find('.fa-eye').trigger('click');
                expect(MarkerView.prototype.showMarker).toHaveBeenCalledTimes(0);
                expect(MarkerView.prototype.hideMarker).toHaveBeenCalledTimes(1);
                expect(MarkerView.prototype.render).toHaveBeenCalledTimes(2);
                expect(fixture).toContainElement('.fa-eye-slash');
                expect(fixture).not.toContainElement('.fa-eye');

                //click show marker icon:
                fixture.find('.fa-eye-slash').trigger('click');
                expect(MarkerView.prototype.showMarker).toHaveBeenCalledTimes(1);
                expect(MarkerView.prototype.hideMarker).toHaveBeenCalledTimes(1);
                expect(MarkerView.prototype.render).toHaveBeenCalledTimes(3);
                expect(fixture).toContainElement('.fa-eye');
                expect(fixture).not.toContainElement('.fa-eye-slash');
            });

            it("highlights when hoverHighlight called", function () {
                expect(MarkerView.prototype.clearHoverHighlight).toHaveBeenCalledTimes(0);
                expect(fixture.find('li').hasClass('hover-highlight')).toBeFalsy();
                markerView.hoverHighlight();
                expect(fixture.find('li').hasClass('hover-highlight')).toBeTruthy();
                expect(MarkerView.prototype.clearHoverHighlight).toHaveBeenCalledTimes(1);
            });
            it("does not highlight when hoverHighlight called if active", function () {
                markerView.model.set('active', true);
                expect(fixture.find('a').hasClass('highlight')).toBeTruthy();
                expect(MarkerView.prototype.clearHoverHighlight).toHaveBeenCalledTimes(0);
                expect(fixture.find('li').hasClass('hover-highlight')).toBeFalsy();
                markerView.hoverHighlight();
                expect(fixture.find('li').hasClass('hover-highlight')).toBeFalsy();
            });

            it("active / inactive marker status changes color", function () {
                markerView.model.set('active', true);
                expect(fixture.find('a').hasClass('highlight')).toBeTruthy();
                markerView.model.set('active', false);
                expect(fixture.find('a').hasClass('highlight')).toBeFalsy();
            });

            it("unhighlights when clearHoverHighlight called", function () {
                fixture.find('li').addClass('hover-highlight');
                expect(fixture.find('li').hasClass('hover-highlight')).toBeTruthy();
                markerView.clearHoverHighlight();
                expect(fixture.find('li').hasClass('hover-highlight')).toBeFalsy();
            });

            it("hides marker when hideMarker called", function () {
                expect(MarkerView.prototype.redrawHidden).toHaveBeenCalledTimes(0);
                expect(BaseModel.prototype.trigger).toHaveBeenCalledTimes(1);
                expect(BaseModel.prototype.trigger).toHaveBeenCalledWith('show-marker');
                expect(MarkerView.prototype.render).toHaveBeenCalledTimes(1);
                expect(MarkerView.prototype.saveState).toHaveBeenCalledTimes(0);
                markerView.hideMarker();
                expect(markerView.displayOverlay).toBeFalsy();
                expect(BaseModel.prototype.trigger).toHaveBeenCalledWith('hide-marker');
                expect(MarkerView.prototype.redrawHidden).toHaveBeenCalledTimes(1);
                expect(BaseModel.prototype.trigger).toHaveBeenCalledTimes(2);
                expect(MarkerView.prototype.render).toHaveBeenCalledTimes(2);
                expect(MarkerView.prototype.saveState).toHaveBeenCalledTimes(1);
            });

            it("shows marker when showMarker called", function () {
                expect(MarkerView.prototype.redrawVisible).toHaveBeenCalledTimes(0);
                expect(BaseModel.prototype.trigger).toHaveBeenCalledTimes(1);
                expect(BaseModel.prototype.trigger).toHaveBeenCalledWith('show-marker');
                expect(MarkerView.prototype.render).toHaveBeenCalledTimes(1);
                expect(MarkerView.prototype.saveState).toHaveBeenCalledTimes(0);
                markerView.displayOverlay = false;
                markerView.showMarker();
                expect(markerView.displayOverlay).toBeTruthy();
                expect(BaseModel.prototype.trigger).toHaveBeenCalledWith('show-marker');
                expect(MarkerView.prototype.redrawVisible).toHaveBeenCalledTimes(1);
                expect(BaseModel.prototype.trigger).toHaveBeenCalledTimes(2);
                expect(MarkerView.prototype.render).toHaveBeenCalledTimes(2);
                expect(MarkerView.prototype.saveState).toHaveBeenCalledTimes(1);
            });

            it("gives a visual cue that the overlay is visible", function () {
                markerView.showMarker();
                expect(fixture).toContainElement('.fa-eye');
                expect(fixture).not.toContainElement('.fa-eye-slash');
            });

            it("gives a visual cue that the overlay is hidden", function () {
                markerView.hideMarker();
                expect(fixture).toContainElement('.fa-eye-slash');
                expect(fixture).not.toContainElement('.fa-eye');
            });
        });

    });
