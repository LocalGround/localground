var rootDir = "../../";
define([
    "backbone",
    rootDir + "lib/media/edit-media-info",
],
    function (Backbone, EditMediaInfo) {
        'use strict';
        const initEditMediaInfo = function (scope, mediaType) {

            // 1) add spies for all relevant objects:
            spyOn(EditMediaInfo.prototype, 'initialize').and.callThrough();
            spyOn(EditMediaInfo.prototype, 'render').and.callThrough();

            //spyOn(Map.prototype, 'save');

            // 2) add dummy HTML elements:
            scope.fixture = setFixtures('<div></div>');

            // 3) initialize view:
            let mediaModel;
            if (mediaType === 'photos') {
                mediaModel = scope.app.dataManager.getCollection('photos').get(20);
            } else if (mediaType === 'videos') {
                mediaModel = scope.app.dataManager.getCollection('videos').get(50);
            } else if (mediaType === 'audio') {
                mediaModel = scope.app.dataManager.getCollection('audio').get(3);
            } else {
                mediaModel = scope.app.dataManager.getCollection('photos').get(20);
            }
             
            scope.editMediaInfo = new EditMediaInfo({
                app: scope.app,
                model: mediaModel
            });
            scope.editMediaInfo.render();
        };

        describe('EditMediaInfo (with photo)', function () {
            beforeEach(function () {
                initEditMediaInfo(this, 'photo');
            });

            it('initialize works', function() {
                expect(this.editMediaInfo).toEqual(jasmine.any(EditMediaInfo));
                expect(this.editMediaInfo.model.id).toEqual(20);
            });

            it('renders correct info', function() {
                expect(this.editMediaInfo.model.get('attribution')).toEqual('riley');
                expect(this.editMediaInfo.model.get('caption')).toEqual(null);

                expect(this.editMediaInfo.$el.find('#media-attribution').val()).toEqual('riley');
                expect(this.editMediaInfo.$el.find('#media-caption').val()).toEqual('');
            });

            it('renders photos properly', function() {
                expect(this.editMediaInfo.$el).toContainElement('img');
                expect(this.editMediaInfo.$el).not.toContainElement('iframe');
                expect(this.editMediaInfo.$el).not.toContainElement('.edit-audio');
                expect(this.editMediaInfo.$el.find('img')[0].src).toEqual(
                    this.editMediaInfo.model.get('path_large')
                );
            });
            
            it('saveMediaInfo() works', function() {
                this.editMediaInfo.$el.find('#media-attribution').val('George Washington');
                this.editMediaInfo.$el.find('#media-caption').val('photo of building');

                expect(this.editMediaInfo.model.get('attribution')).toEqual('riley');
                expect(this.editMediaInfo.model.get('caption')).toEqual(null);

                this.editMediaInfo.saveMediaInfo();

                expect(this.editMediaInfo.model.get('attribution')).toEqual('George Washington');
                expect(this.editMediaInfo.model.get('caption')).toEqual('photo of building');
            });
        });
        describe('EditMediaInfo (with video)', function () {
            beforeEach(function () {
                initEditMediaInfo(this, 'videos');
            });

            it('initialize works', function() {
                expect(this.editMediaInfo).toEqual(jasmine.any(EditMediaInfo));
                expect(this.editMediaInfo.model.id).toEqual(50);
            });

            it('renders correct info', function() {
                expect(this.editMediaInfo.model.get('attribution')).toEqual(null);
                expect(this.editMediaInfo.model.get('caption')).toEqual(null);

                expect(this.editMediaInfo.$el.find('#media-attribution').val()).toEqual('');
                expect(this.editMediaInfo.$el.find('#media-caption').val()).toEqual('');
            });

            it('renders photos properly', function() {
                expect(this.editMediaInfo.$el).toContainElement('iframe');
                expect(this.editMediaInfo.$el).not.toContainElement('img');
                expect(this.editMediaInfo.$el).not.toContainElement('.edit-audio');
                expect(this.editMediaInfo.$el.find('iframe')[0].src).toEqual(
                    `https://www.youtube.com/embed/${this.editMediaInfo.model.get('video_id')}?ecver=1`
                );
            });
        });
        describe('EditMediaInfo (with audio)', function () {
            beforeEach(function () {
                initEditMediaInfo(this, 'audio');
            });

            it('initialize works', function() {
                expect(this.editMediaInfo).toEqual(jasmine.any(EditMediaInfo));
                expect(this.editMediaInfo.model.id).toEqual(3);
            });

            it('renders correct info', function() {
                expect(this.editMediaInfo.model.get('attribution')).toEqual('vanwars');
                expect(this.editMediaInfo.model.get('caption')).toEqual(null);
                expect(this.editMediaInfo.model.get('name')).toEqual('tmpvpqx0b.mp3');

                expect(this.editMediaInfo.$el.find('#media-attribution').val()).toEqual('vanwars');
                expect(this.editMediaInfo.$el.find('#media-caption').val()).toEqual('');
                expect(this.editMediaInfo.$el.find('#media-name').val()).toEqual('tmpvpqx0b.mp3');
            });

            it('renders photos properly', function() {
                expect(this.editMediaInfo.$el).toContainElement('.edit-audio');
                expect(this.editMediaInfo.$el).not.toContainElement('iframe');
                expect(this.editMediaInfo.$el).not.toContainElement('img');
                
                expect(this.editMediaInfo.$el.find('source')[0].src).toEqual(
                    this.editMediaInfo.model.get('file_path')
                );
            });
        });
    });
