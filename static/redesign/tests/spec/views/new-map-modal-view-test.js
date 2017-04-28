var rootDir = "../../";
define([
    "marionette",
    "jquery",
    rootDir + "apps/style/views/left/select-map-view",
    rootDir + "apps/style/views/left/new-map-modal-view", 
    rootDir + "lib/modals/modal"
],
    function (Marionette, $, SelectMapView, NewMapModal, Modal) {
        'use strict';
        var modalView, fixture;

        function initView(scope) {
            // 1) add spies for all relevant objects:
          
            spyOn(NewMapModal.prototype, 'initialize').and.callThrough();
            spyOn(scope.app.vent, "trigger");
    
            fixture = setFixtures('<div></div>');

            // 2) initialize rightPanel object:
            modalView = new NewMapModal({
                app: scope.app
            });
            modalView.render();

            // 3) set fixture:
            fixture.append(modalView.$el); 
        };
       
       describe("When NewMapModal is initialized", function () {
            beforeEach(function () {
                initView(this);
            });

            afterEach(function () {
                Backbone.history.stop();
            });

            it("should initialize", function () {
                expect(modalView).toEqual(jasmine.any(NewMapModal));
                expect(modalView.initialize).toHaveBeenCalledTimes(1);
            });

            it("should have correct html", function () {
                expect(fixture).toContainElement('#new-map-name');  expect(fixture).toContainElement('#new-map-slug');  
            });

        });

        describe("Test functions", function() {
            beforeEach(function () {
                initView(this);
            });

            afterEach(function () {
                Backbone.history.stop();
            });
            it("should generate correct slug", function () {
                $("#new-map-name").val("Map 1");
                modalView.generateSlug();
                expect($("#new-map-slug").val()).toEqual("map-1");
            });
            it("should save correct information from fields", function() {
                $("#new-map-name").val("Map 1");
                modalView.generateSlug();
                modalView.saveMap();
                expect(modalView.app.vent.trigger).toHaveBeenCalledWith("create-new-map", {name: "Map 1", slug: "map-1"});
            });
        });
    });


