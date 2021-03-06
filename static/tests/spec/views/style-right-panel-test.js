var rootDir = '../../';
define([
    rootDir + 'apps/style/views/right/right-panel'
],
    function (RightPanelView) {
        'use strict';
        var rightPanel, fixture, initView = function (scope) {
            // 1) add spies for all relevant objects:
            spyOn(RightPanelView.prototype, 'initialize').and.callThrough();
            spyOn(RightPanelView.prototype, 'createLayer').and.callThrough();
            spyOn(RightPanelView.prototype, 'saveLayer').and.callThrough();

            // 2) initialize rightPanel object:
            rightPanel = new RightPanelView({
                app: scope.app,
                model: scope.layer,
                collection: scope.layer.getSymbols()
            });
            rightPanel.render();
            //console.log(scope.layer.get("symbols"));
            //console.log(scope.layer.getSymbols());

            // 3) set fixture:
            fixture = setFixtures('<div></div>').append(rightPanel.$el);
        };

        describe("When Right Panel of Style App is initialized", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize", function () {
                expect(rightPanel).toEqual(jasmine.any(RightPanelView));
                expect(rightPanel.initialize).toHaveBeenCalledTimes(1);
            });

            it("should have correct html", function () {
                //has correct layout template
                expect(fixture).toContainElement('#data_source_region');
            });
        });

        describe("When edit-layer event is pushed (from left panel)", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should call createLayer()", function () {
                // gets called once from our init function initializing the view
                expect(rightPanel.createLayer).toHaveBeenCalledTimes(1);

                //has correct model
                expect(rightPanel.model).toEqual(this.layer);

                //has correct child (region) templates
                expect(fixture).toContainElement('.layer-title');
                expect(fixture).toContainElement('.marker-style');
            });
        });

        describe("When save button is pressed", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should call saveLayer()", function () {
                this.app.start();
                expect(rightPanel.saveLayer).toHaveBeenCalledTimes(0);
                fixture.find('.layer-save').trigger("click");
                expect(rightPanel.saveLayer).toHaveBeenCalledTimes(1);
            });
        });
    });
