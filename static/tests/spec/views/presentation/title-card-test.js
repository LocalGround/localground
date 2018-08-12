var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/presentation/views/title-card",
    rootDir + "lib/carousel/carousel",
    rootDir + "lib/audio/audio-player"
],
    function (Backbone, TitleCard, Carousel, AudioPlayer) {
        'use strict';
        const initSpies = function () {

            // 1) add spies for all relevant objects:
            spyOn(TitleCard.prototype, 'initialize').and.callThrough();
            spyOn(Carousel.prototype, 'initialize').and.callThrough();
            spyOn(AudioPlayer.prototype, 'initialize').and.callThrough();
            spyOn(TitleCard.prototype, 'render').and.callThrough();
            spyOn(TitleCard.prototype, 'getPhotoVideoCollection').and.callThrough();
            spyOn(TitleCard.prototype, 'getAudioModels').and.callThrough();
            spyOn(TitleCard.prototype, 'renderCarousel').and.callThrough();
            spyOn(TitleCard.prototype, 'renderAudioPlayers').and.callThrough();

        };

        describe("TitleCard: All tests", function () {
            beforeEach(function () {
                initSpies(this);
            });

            it("should render view container HTML", function () {
                this.titleCard = new TitleCard({
                    model: this.map.getTitleCardModel(),
                    app: this.app,
                });
                expect(Carousel.prototype.initialize).toHaveBeenCalledTimes(0);
                expect(AudioPlayer.prototype.initialize).toHaveBeenCalledTimes(0);
                expect(this.titleCard.renderCarousel).toHaveBeenCalledTimes(0);
                expect(this.titleCard.renderAudioPlayers).toHaveBeenCalledTimes(0);

                this.titleCard.render();

                expect(this.titleCard.renderCarousel).toHaveBeenCalledTimes(1);
                expect(this.titleCard.renderAudioPlayers).toHaveBeenCalledTimes(1);
                expect(Carousel.prototype.initialize).toHaveBeenCalledTimes(1);
                expect(AudioPlayer.prototype.initialize).toHaveBeenCalledTimes(2);

                expect(this.titleCard.$el).toContainElement('.title-card_header');
                expect(this.titleCard.$el).toContainElement('.carousel');
                expect(this.titleCard.$el).toContainElement('.audio-players');
                expect(this.titleCard.$el).toContainElement('.title-card_body');
                expect(this.titleCard.$el.find('.carousel-content li').length).toEqual(3);
                expect(this.titleCard.$el.find('.audio-detail').length).toEqual(2);
            });

            it("getPhotoVideoCollection should return 2 photos and 1 video", function () {
                this.titleCard = new TitleCard({
                    model: this.map.getTitleCardModel(),
                    app: this.app,
                });
                const collection = this.titleCard.getPhotoVideoCollection(this.app.dataManager);
                expect(collection.at(0).get('overlay_type')).toEqual('photo');
                expect(collection.at(0).get('id')).toEqual(4);
                expect(collection.at(1).get('overlay_type')).toEqual('photo');
                expect(collection.at(1).get('id')).toEqual(5);
                expect(collection.at(2).get('overlay_type')).toEqual('video');
                expect(collection.at(2).get('id')).toEqual(50);
            });

            it("getAudioModels should return 2 audio models", function () {
                this.titleCard = new TitleCard({
                    model: this.map.getTitleCardModel(),
                    app: this.app,
                });
                const collection = this.titleCard.getAudioModels();
                expect(collection.at(0).get('overlay_type')).toEqual('audio');
                expect(collection.at(0).get('id')).toEqual(4);
                expect(collection.at(1).get('overlay_type')).toEqual('audio');
                expect(collection.at(1).get('id')).toEqual(3);
            });

            it("works OK with empty media", function () {
                this.titleCard = new TitleCard({
                    model: this.app.dataManager.getMaps().at(1).getTitleCardModel(),
                    app: this.app,
                });
                expect(this.titleCard.getPhotoVideoCollection(this.app.dataManager).length).toEqual(0);
                expect(this.titleCard.getAudioModels().length).toEqual(0);
            });

            it("does not call carousel or player functions if empty media", function () {
                expect(Carousel.prototype.initialize).toHaveBeenCalledTimes(0);
                expect(AudioPlayer.prototype.initialize).toHaveBeenCalledTimes(0);
                this.titleCard = new TitleCard({
                    model: this.app.dataManager.getMaps().at(1).getTitleCardModel(),
                    app: this.app,
                });
                this.titleCard.render();
                expect(Carousel.prototype.initialize).toHaveBeenCalledTimes(0);
                expect(AudioPlayer.prototype.initialize).toHaveBeenCalledTimes(0);
            });



            // it("saveTitleCard() works", function() {
            //     expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.header).toEqual('Test Map Title');
            //     expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.description).toEqual('Test description of the map.');
            //
            //     this.editTitleCard.$el.find('.title-card_title').val('Test Title 22');
            //     this.editTitleCard.$el.find('.title-card_textarea').val('This is the description for this map');
            //
            //     this.editTitleCard.saveTitleCard();
            //
            //     expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.header).toEqual('Test Title 22');
            //     expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.description).toEqual('This is the description for this map');
            // });
            //
            // it("attachMedia() works", function() {
            //     expect(EditTitleCard.prototype.render).toHaveBeenCalledTimes(1);
            //     expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.photo_ids.length).toEqual(3);
            //
            //     // photo 7 already in list. Test to make sure it doesn't gett added again.
            //     const photoObjs = [{id: 23}, {id: 25}, {id: 7}];
            //
            //     this.editTitleCard.attachMedia(photoObjs);
            //
            //     expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.photo_ids.length).toEqual(5);
            //
            //     expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.photo_ids.includes(23)).toEqual(true);
            //     expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.photo_ids.includes(25)).toEqual(true);
            //
            //     expect(EditTitleCard.prototype.render).toHaveBeenCalledTimes(2);
            // });
            //
            // it("detachMedia() works", function() {
            //     expect(EditTitleCard.prototype.render).toHaveBeenCalledTimes(1);
            //     expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.photo_ids.includes(7)).toEqual(true);
            //     expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.photo_ids.length).toEqual(3);
            //
            //     this.editTitleCard.$el.find('.detach_media[data-id="7"]').click();
            //
            //     expect(EditTitleCard.prototype.render).toHaveBeenCalledTimes(2);
            //     expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.photo_ids.includes(7)).toEqual(false);
            //     expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.photo_ids.length).toEqual(2);
            // });
            //
            // it("displays attached photos", function() {
            //     expect(this.editTitleCard.activeMap.get('metadata').titleCardInfo.photo_ids.length).toEqual(3);
            //     expect(this.editTitleCard.$el.find('.photo-attached').length).toEqual(3);
            // });
        });
    });
