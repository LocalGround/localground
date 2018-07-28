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
                expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.header).toEqual('Test Map Title');
                expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.description).toEqual('Test description of the map.');

                this.editTitleCard.$el.find('.title-card_title').val('Test Title 22');
                this.editTitleCard.$el.find('.title-card_textarea').val('This is the description for this map');

                this.editTitleCard.saveTitleCard();

                expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.header).toEqual('Test Title 22');
                expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.description).toEqual('This is the description for this map');
            });

            it("attachMedia() works", function() {
                expect(EditTitleCard.prototype.render).toHaveBeenCalledTimes(1);
                expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.photo_ids.length).toEqual(3);

                // photo 7 already in list. Test to make sure it doesn't gett added again.
                const photoObjs = [{id: 23}, {id: 25}, {id: 7}]; 

                this.editTitleCard.attachMedia(photoObjs);

                expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.photo_ids.length).toEqual(5);

                expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.photo_ids.includes(23)).toEqual(true);
                expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.photo_ids.includes(25)).toEqual(true);
                
                expect(EditTitleCard.prototype.render).toHaveBeenCalledTimes(2);
            });

            it("detachMedia() works", function() {
                expect(EditTitleCard.prototype.render).toHaveBeenCalledTimes(1);
                expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.photo_ids.includes(7)).toEqual(true);
                expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.photo_ids.length).toEqual(3);

                this.editTitleCard.$el.find('.detach_media[data-id="7"]').click();

                expect(EditTitleCard.prototype.render).toHaveBeenCalledTimes(2);
                expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.photo_ids.includes(7)).toEqual(false);
                expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.photo_ids.length).toEqual(2);
            });

            it("displays attached photos", function() {
                expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.photo_ids.length).toEqual(3);
                expect(this.editTitleCard.$el.find('.photo-attached').length).toEqual(3);
            }); 
        });
    });
