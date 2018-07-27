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

            scope.editTitleCard.render();
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
            
            it("saveTitleCard() works", function() {
                expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.header).toEqual(null);
                expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.description).toEqual(null);

                this.editTitleCard.$el.find('.title-card_title').val('Test Title 22');
                this.editTitleCard.$el.find('.title-card_textarea').val('This is the description for this map');

                this.editTitleCard.saveTitleCard();

                expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.header).toEqual('Test Title 22');
                expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.description).toEqual('This is the description for this map');
            });

            it("display any attached photos", function() {
                expect(this.editTitleCard.$el.find('photos').length).toEqual(3);
            }); 
        });
    });
