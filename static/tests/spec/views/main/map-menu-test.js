var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/map-menu",
    rootDir + "models/map",
    rootDir + "lib/modals/modal",
    "apps/main/views/left/new-map-modal-view",
    "tests/spec-helper1"
],
    function (Backbone, MapMenu, Map, Modal, CreateMapForm) {
        'use strict';
        const initMapMenu = function (scope) {

            // 1) add spies for all relevant objects:
            spyOn(MapMenu.prototype, 'initialize').and.callThrough();
            spyOn(MapMenu.prototype, 'render').and.callThrough();
            spyOn(MapMenu.prototype, 'showAddMapModal').and.callThrough();
            spyOn(CreateMapForm.prototype, 'initialize').and.callThrough();
            spyOn(Modal.prototype, 'show').and.callThrough();

            // 2) add dummy HTML elements:
            scope.fixture = setFixtures('<div></div>');

            // 3) initialize Toolbar:
            scope.mapMenu = new MapMenu({
                app: scope.app,
                collection: scope.dataManager.getMaps(),
                activeMap: scope.dataManager.getMaps().at(0)
            });
        };

        describe("MapMenu templates: ", function () {
            beforeEach(function () {
                initMapMenu(this);
            });

            it("should render map list correctly", function () {
                this.mapMenu.render();
                expect(this.mapMenu.$el.find('li').length).toEqual(3);
                let i = 0;
                const $menu = this.mapMenu.$el.find('ul');
                this.mapMenu.collection.each(map => {
                    expect($menu).toContainText(map.get('name'));
                    expect($menu).toContainElement('a[href="#/' + map.id + '"]');
                    i++;
                });
                expect(i).toEqual(2);
            });

            it("should render add button correctly", function () {
                this.mapMenu.render();
                const $menu = this.mapMenu.$el.find('ul');
                expect($menu).toContainElement('.add-map');
                expect(this.mapMenu.$el.find('.add-map')).toContainText('Add Map');
            });

        });
        describe("MapMenu event handlers: ", function () {
            beforeEach(function () {
                initMapMenu(this);
            });

            it("should show the create map modal form", function () {
                this.mapMenu.render();
                expect(MapMenu.prototype.showAddMapModal).toHaveBeenCalledTimes(0);
                expect(Modal.prototype.show).toHaveBeenCalledTimes(0);
                expect(CreateMapForm.prototype.initialize).toHaveBeenCalledTimes(0);

                //spoof user click to add new map:
                this.mapMenu.$el.find('.add-map').trigger('click');
                expect(MapMenu.prototype.showAddMapModal).toHaveBeenCalledTimes(1);
                expect(Modal.prototype.show).toHaveBeenCalledTimes(1);
                expect(CreateMapForm.prototype.initialize).toHaveBeenCalledTimes(1);
                expect(this.mapMenu.modal.view).toEqual(jasmine.any(CreateMapForm));
            });

        });

    });
