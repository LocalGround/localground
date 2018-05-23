var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/breadcrumbs",
    rootDir + "lib/popovers/popover",
    rootDir + "apps/main/views/map-menu",
    "tests/spec-helper1"
],
    function (Backbone, Breadcrumbs, Popover, MapMenu) {
        'use strict';
        const initToolbar = function (scope) {

            // 1) add spies for all relevant objects:
            spyOn(Breadcrumbs.prototype, 'initialize').and.callThrough();
            spyOn(Breadcrumbs.prototype, 'render').and.callThrough();
            spyOn(Breadcrumbs.prototype, 'showMapMenu').and.callThrough();
            spyOn(Popover.prototype, 'update').and.callThrough();
            spyOn(MapMenu.prototype, 'initialize').and.callThrough();

            // 2) add dummy HTML elements:
            scope.fixture = setFixtures('<div id="breadcrumb" class="breadcrumb"></div>');

            // 3) initialize Toolbar:
            scope.toolbar = new Breadcrumbs({
                app: scope.app,
                model: scope.dataManager.getProject(),
                collection: scope.dataManager.getMaps(),
                activeMap: scope.dataManager.getMaps().at(0)
            });
        };

        describe("Breadcrumbs initialization: ", function () {
            beforeEach(function () {
                initToolbar(this);
            });

            it("should initialize correctly", function () {
                expect(this.toolbar.initialize).toHaveBeenCalledTimes(1);
                expect(this.toolbar).toEqual(jasmine.any(Breadcrumbs));
                expect(this.toolbar.model).toEqual(this.dataManager.getProject());
                expect(this.toolbar.collection).toEqual(this.dataManager.getMaps());
            });

        });

        describe("Breadcrumbs templates: ", function () {
            beforeEach(function () {
                initToolbar(this);
            });

            it("should render breadcrumbs correctly", function () {
                this.toolbar.render();
                expect(this.toolbar.$el).toContainText(this.toolbar.model.get('name'));
                expect(this.toolbar.$el.find('.breadcrumb-hover').length).toEqual(3);
            });

        });
        describe("Breadcrumbs event handlers: ", function () {
            beforeEach(function () {
                initToolbar(this);
            });

            it("should show the map list on click", function () {
                this.toolbar.render();
                const $menu = this.toolbar.$el.find('#map-list');
                expect(Breadcrumbs.prototype.showMapMenu).toHaveBeenCalledTimes(0);
                this.toolbar.$el.find('#map-menu').trigger('click');
                expect(Breadcrumbs.prototype.showMapMenu).toHaveBeenCalledTimes(1);

            });

            it("should show the map menu via the popover", function () {
                this.toolbar.render();
                expect(Popover.prototype.update).toHaveBeenCalledTimes(0);
                expect(MapMenu.prototype.initialize).toHaveBeenCalledTimes(0);
                this.toolbar.$el.find('#map-menu').trigger('click');
                expect(Popover.prototype.update).toHaveBeenCalledTimes(1);
                expect(MapMenu.prototype.initialize).toHaveBeenCalledTimes(1);
            });

            it("should listens for collection update", function () {
                this.toolbar.render();
                expect(Breadcrumbs.prototype.render).toHaveBeenCalledTimes(1);
                this.toolbar.collection.trigger('update');
                expect(Breadcrumbs.prototype.render).toHaveBeenCalledTimes(2);
            });

        });

    });
