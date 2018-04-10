var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/left/map-title-view",
    rootDir + "lib/modals/modal",
    "tests/spec-helper1"
],
    function (Backbone, MapTitleView, Modal) {
        'use strict';
        const initView = function (scope) {

            // 1) add spies for all relevant objects:
            spyOn(MapTitleView.prototype, 'initialize').and.callThrough();
            spyOn(MapTitleView.prototype, 'showEditModal').and.callThrough();

            // 2) add dummy HTML elements:
            //scope.fixture = setFixtures('<div id="breadcrumb" class="breadcrumb"></div>');

            // 3) initialize Toolbar:
            scope.mapTitleView  = new MapTitleView({
                app: scope.app,
                model: scope.dataManager.getMaps().at(0)
            });
        };

        describe("Map Title View initialization: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.mapTitleView.initialize).toHaveBeenCalledTimes(1);
                expect(this.mapTitleView.modal).toEqual(jasmine.any(Modal));
                expect(this.mapTitleView.model).toEqual(this.dataManager.getMaps().at(0));
            });

            it("should render correctly", function () {
                this.mapTitleView.render();
                const $el = this.mapTitleView.$el;
                expect($el).toContainElement('.selected-map');
                expect($el).toContainElement('.selected-map-item');
                expect($el).toContainElement('.selected-map-name');
                //expect($el).toContainElement('i.fa.fa-pencil');
                expect($el).toContainElement('i.fa.fa-eye');

                expect($el.find('.selected-map-name'))
                    .toContainText(this.mapTitleView.model.get("name"));
            });

            it("should listen for events", function () {
                this.mapTitleView.render();
                const $el = this.mapTitleView.$el;
                expect(this.mapTitleView.showEditModal).toHaveBeenCalledTimes(0);
                $el.trigger('click');
                expect(this.mapTitleView.showEditModal).toHaveBeenCalledTimes(1);

            });

        });

    });
