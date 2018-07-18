var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/presentation-options",
    rootDir + "apps/main/views/edit-title-card"
],
    function (Backbone, PresentationOptions, EditTitleCard) {
        'use strict';
        const initTitleCardMenu = function (scope) {

            // 1) add spies for all relevant objects:
            spyOn(PresentationOptions.prototype, 'initialize').and.callThrough();
            spyOn(PresentationOptions.prototype, 'render').and.callThrough();

            // 2) add dummy HTML elements:
            scope.fixture = setFixtures('<div></div>');

            // 3) initialize Toolbar:
            scope.presentationOptions = new PresentationOptions({
                app: scope.app,
                activeMap: scope.dataManager.getMaps().at(0)
            });
            scope.presentationOptions.render();
        };

        describe("PresentationOptions", function () {
            beforeEach(function () {
                initTitleCardMenu(this);
            });

            it("initialize works", function() {
                expect(this.presentationOptions).toEqual(jasmine.any(PresentationOptions));
                expect(this.presentationOptions.modal).toEqual(this.presentationOptions.app.modal);
            });

            it("should render view correctly", function () {
                expect(this.presentationOptions.$el).toContainElement('#display-legend');
                expect(this.presentationOptions.$el).toContainElement('#next-prev');
                expect(this.presentationOptions.$el).toContainElement('#pan-zoom');
                expect(this.presentationOptions.$el).toContainElement('#street-view');
                expect(this.presentationOptions.$el).toContainElement('#title-card');
                expect(this.presentationOptions.$el).toContainElement('#edit-title-card');
            });
            
            it("showTitleCardModal() should open modal", function() {
                expect(this.presentationOptions.modal.view).toEqual(null);
                this.presentationOptions.showTitleCardModal();
                expect(this.presentationOptions.modal.view).toEqual(jasmine.any(EditTitleCard));
            });
        });
    });
