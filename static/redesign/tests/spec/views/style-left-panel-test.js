var rootDir = "../../";
define([
    "jquery",
    rootDir + "apps/style/views/left/left-panel"
],
    function ($, LeftPanelView) {
        'use strict';
        var leftPanel, fixture;

        function initView(scope) {
            // 1) add spies for all relevant objects:
            spyOn(LeftPanelView.prototype, 'initialize').and.callThrough();
            spyOn(LeftPanelView.prototype, 'handleNewMap').and.callThrough();
            spyOn(LeftPanelView.prototype, 'moveLeftPanel').and.callThrough();
            spyOn(LeftPanelView.prototype, 'showRightPanel').and.callThrough();
            spyOn(LeftPanelView.prototype, 'createNewLayer').and.callThrough();


            // 2) initialize rightPanel object:
            leftPanel = new LeftPanelView({
                app: scope.app,
                model: scope.layer
            });

            // 3) set fixture:
            fixture = setFixtures('<div></div>').append(leftPanel.$el);
        };

        describe("When Left Panel of Style App is initialized", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize", function () {
                expect(leftPanel).toEqual(jasmine.any(LeftPanelView));
                expect(leftPanel.initialize).toHaveBeenCalledTimes(1);
            });

            it("should have correct html", function () {
                //has correct layout template
                expect(fixture).toContainElement('.left-wrapper');    
            });
        });

        describe("Events should trigger correctly", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should call handleNewMap()", function () {
                expect(leftPanel.handleNewMap).toHaveBeenCalledTimes(0);
                leftPanel.app.vent.trigger('change-map', this.testMap);
                expect(leftPanel.handleNewMap).toHaveBeenCalledTimes(1);

                //has correct model
                expect(leftPanel.model).toEqual(this.layer);

                //has correct child (region) templates
                expect(fixture).toContainElement('#map-select');
                expect(fixture).toContainElement('.bordered-section');
            });

            it("should trigger click events", function () {
                expect(leftPanel.moveLeftPanel).toHaveBeenCalledTimes(0);
                fixture.find('.hide-button').trigger("click");
                expect(leftPanel.moveLeftPanel).toHaveBeenCalledTimes(1);

                expect(leftPanel.showRightPanel).toHaveBeenCalledTimes(0);
                fixture.find('.edit').trigger("click");
                expect(leftPanel.showRightPanel).toHaveBeenCalledTimes(1);

                //these two aren't working
                expect(leftPanel.createNewLayer).toHaveBeenCalledTimes(0);
                fixture.find('#new-layer-options a').trigger("click");
                expect(leftPanel.createNewLayer).toHaveBeenCalledTimes(1);

                
            });
            
        });

        
    });
