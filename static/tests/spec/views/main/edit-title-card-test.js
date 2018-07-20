var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/edit-title-card"
],
    function (Backbone, EditTitleCard) {
        'use strict';
        const initTitleCardMenu = function (scope) {

            // 1) add spies for all relevant objects:
            spyOn(EditTitleCard.prototype, 'initialize').and.callThrough();
            spyOn(EditTitleCard.prototype, 'render').and.callThrough();

            // 2) add dummy HTML elements:
            scope.fixture = setFixtures('<div></div>');

            // 3) initialize Toolbar:
            scope.editTitleCard = new EditTitleCard({
                app: scope.app,
                activeMap: scope.dataManager.getMaps().at(0)
            });
        };

        describe("EditTitleCard", function () {
            beforeEach(function () {
                initTitleCardMenu(this);
            });

            it("should render view correctly", function () {
                this.editTitleCard.render();
                expect(this.editTitleCard.$el).toContainElement('.title-card_title');
                expect(this.editTitleCard.$el).toContainElement('.title-card_textarea');
            });        
        });
    });
