var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/breadcrumbs",
    rootDir + "models/map",
    rootDir + "lib/modals/modal",
    "apps/main/views/left/new-map-modal-view",
    "tests/spec-helper1"
],
    function (Backbone, Breadcrumbs, Map, Modal, CreateMapForm) {
        'use strict';
        const initToolbar = function (scope) {

            // 1) add spies for all relevant objects:
            spyOn(Breadcrumbs.prototype, 'initialize').and.callThrough();
            spyOn(Breadcrumbs.prototype, 'render').and.callThrough();
            spyOn(Breadcrumbs.prototype, 'toggleMapList').and.callThrough();
            spyOn(Breadcrumbs.prototype, 'hideMapList').and.callThrough();
            spyOn(Breadcrumbs.prototype, 'showAddMapModal').and.callThrough();
            spyOn(Modal.prototype, 'show').and.callThrough();
            spyOn(CreateMapForm.prototype, 'initialize').and.callThrough();

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

            it("should listens for collection add", function () {
                expect(Breadcrumbs.prototype.render).toHaveBeenCalledTimes(0);
                this.toolbar.collection.add(
                    new Map({ name: 'My new map' }, { projectID: this.toolbar.model.id })
                );
                expect(Breadcrumbs.prototype.render).toHaveBeenCalledTimes(1);
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

            it("should render map list correctly", function () {
                this.toolbar.render();
                expect(this.toolbar.$el.find('#map-list li').length).toEqual(3);
                this.toolbar.collection.add(
                    new Map({ name: 'My new map', id: 99 }, { projectID: this.toolbar.model.id })
                );
                expect(this.toolbar.$el.find('#map-list li').length).toEqual(4);
                let i = 0;
                const $menu = this.toolbar.$el.find('#map-list');
                this.toolbar.collection.each(map => {
                    expect($menu).toContainText(map.get('name'));
                    expect($menu).toContainElement('a[href="#/' + map.id + '"]');
                    i++;
                });
                expect(i).toEqual(3);
            });

            it("should render add button correctly", function () {
                this.toolbar.render();
                const $menu = this.toolbar.$el.find('#map-list');
                expect($menu).toContainElement('.add-map');
                expect(this.toolbar.$el.find('.add-map')).toContainText('Add Map');
            });

        });
        describe("Breadcrumbs event handlers: ", function () {
            beforeEach(function () {
                initToolbar(this);
            });

            it("should hide the map list if toolbar clicked", function () {
                this.toolbar.render();
                const $menu = this.toolbar.$el.find('#map-list');
                this.toolbar.$el.find('#map-menu').trigger('click');
                expect(Breadcrumbs.prototype.toggleMapList).toHaveBeenCalledTimes(1);
                expect($menu.css('display')).toEqual('block');

                //spoof user click to hide map menu:
                expect(Breadcrumbs.prototype.hideMapList).toHaveBeenCalledTimes(0);
                this.toolbar.$el.trigger('click');
                expect(Breadcrumbs.prototype.hideMapList).toHaveBeenCalledTimes(1);
                expect($menu.css('display')).toEqual('none');
            });

            it("should show / hide the map list on click", function () {
                this.toolbar.render();
                const $menu = this.toolbar.$el.find('#map-list');
                expect($menu.css('display')).toEqual('none');
                expect(Breadcrumbs.prototype.toggleMapList).toHaveBeenCalledTimes(0);
                expect(Breadcrumbs.prototype.hideMapList).toHaveBeenCalledTimes(0);

                //spoof user click to show map menu:
                this.toolbar.$el.find('#map-menu').trigger('click');
                expect(Breadcrumbs.prototype.toggleMapList).toHaveBeenCalledTimes(1);
                expect($menu.css('display')).toEqual('block');

            });

            it("should show the create map modal form", function () {
                this.toolbar.render();
                expect(Breadcrumbs.prototype.showAddMapModal).toHaveBeenCalledTimes(0);
                expect(Modal.prototype.show).toHaveBeenCalledTimes(0);
                expect(CreateMapForm.prototype.initialize).toHaveBeenCalledTimes(0);

                //spoof user click to add new map:
                this.toolbar.$el.find('.add-map').trigger('click');
                expect(Breadcrumbs.prototype.showAddMapModal).toHaveBeenCalledTimes(1);
                expect(Modal.prototype.show).toHaveBeenCalledTimes(1);
                expect(CreateMapForm.prototype.initialize).toHaveBeenCalledTimes(1);
                expect(this.toolbar.modal.view).toEqual(jasmine.any(CreateMapForm));
            });

        });

    });
