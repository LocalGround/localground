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
            spyOn(EditTitleCard.prototype, 'detachMedia').and.callThrough();


            // 2) add dummy HTML elements:
            scope.fixture = setFixtures('<div></div>');

            // 3) initialize Toolbar:
            const map = scope.dataManager.getMaps().at(0);
            scope.editTitleCard = new EditTitleCard({
                app: scope.app,
                activeMap: map,
                model: map.getTitleCardModel()
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

                expect(this.editTitleCard.model.get('header')).toEqual('Test Title 22');
                expect(this.editTitleCard.model.get('description')).toEqual('This is the description for this map');
            });

            it("attachMedia() works", function() {
                const dm = this.app.dataManager;
                expect(EditTitleCard.prototype.render).toHaveBeenCalledTimes(1);
                expect(this.editTitleCard.model.getPhotoVideoCollection(dm).length).toEqual(3);

                // photo 19 already in list. Test to make sure it doesn't get added again.
                const p1 = dm.getPhoto(19);
                const p2 = dm.getPhoto(18);
                const p3 = dm.getPhoto(17);
                this.editTitleCard.attachMedia([p1, p2, p3]);

                expect(this.editTitleCard.model.getPhotoVideoCollection(dm).length).toEqual(5);

                const photos = this.editTitleCard.model.getPhotoVideoCollection(dm);
                expect(photos.get(p1.id)).toEqual(p1);
                expect(photos.get(p2.id)).toEqual(p2);
                expect(photos.get(p3.id)).toEqual(p3);
                expect(EditTitleCard.prototype.render).toHaveBeenCalledTimes(2);
            });

            it("detachMedia() works", function() {
                const dm = this.app.dataManager;
                const photosVideos = this.editTitleCard.model.getPhotoVideoCollection(dm);
                const p1 = dm.getPhoto(20);

                expect(EditTitleCard.prototype.detachMedia).toHaveBeenCalledTimes(0);
                expect(EditTitleCard.prototype.render).toHaveBeenCalledTimes(1);
                expect(photosVideos.get(p1).id).toEqual(p1.id);
                expect(photosVideos.length).toEqual(3);

                this.editTitleCard.$el.find('.detach_media[data-id="20"]').click();
                expect(EditTitleCard.prototype.detachMedia).toHaveBeenCalledTimes(1);
                expect(photosVideos.get(p1)).toBeUndefined();
                expect(photosVideos.length).toEqual(2);
                expect(EditTitleCard.prototype.render).toHaveBeenCalledTimes(2);
            });

            it("displays attached photos", function() {
                const dm = this.app.dataManager;
                const photosVideos = this.editTitleCard.model.getPhotoVideoCollection(dm);
                expect(this.editTitleCard.$el.find('.photo-attached').length).toEqual(3);
            });
        });
    });
