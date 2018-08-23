var rootDir = "../../";
define([
    "backbone",
    rootDir + "lib/media/edit-media-info",
],
    function (Backbone, EditMediaInfo) {
        'use strict';
        const initEditMediaInfo = function (scope) {

            // 1) add spies for all relevant objects:
            spyOn(EditMediaInfo.prototype, 'initialize').and.callThrough();
            spyOn(EditMediaInfo.prototype, 'render').and.callThrough();

            //spyOn(Map.prototype, 'save');

            // 2) add dummy HTML elements:
            scope.fixture = setFixtures('<div></div>');

            // 3) initialize view:
            const photo = scope.app.dataManager.getCollection('photos').get(20);
            scope.editMediaInfo = new EditMediaInfo({
                app: scope.app,
                model: photo
            });
            scope.editMediaInfo.render();
        };

        describe('EditMediaInfo', function () {
            beforeEach(function () {
                initEditMediaInfo(this);
            });

            it('initialize works', function() {
                expect(this.editMediaInfo).toEqual(jasmine.any(EditMediaInfo));
                expect(this.editMediaInfo.model.id).toEqual(20);
            });

            it('renders correct info', function() {
                expect(this.editMediaInfo.model.get('attribution')).toEqual('riley');
                expect(this.editMediaInfo.model.get('caption')).toEqual(null);
                expect(this.editMediaInfo.model.get('name')).toEqual('DSC04705.JPG');

                expect(this.editMediaInfo.$el.find('#media-attribution').val()).toEqual('riley');
                expect(this.editMediaInfo.$el.find('#media-caption').val()).toEqual('');
                expect(this.editMediaInfo.$el.find('#media-name').val()).toEqual('DSC04705.JPG');
            });
            
            it('saveMediaInfo() works', function() {
                this.editMediaInfo.$el.find('#media-attribution').val('George Washington');
                this.editMediaInfo.$el.find('#media-caption').val('photo of building');
                this.editMediaInfo.$el.find('#media-name').val('building');

                expect(this.editMediaInfo.model.get('attribution')).toEqual('riley');
                expect(this.editMediaInfo.model.get('caption')).toEqual(null);
                expect(this.editMediaInfo.model.get('name')).toEqual('DSC04705.JPG');

                this.editMediaInfo.saveMediaInfo();

                expect(this.editMediaInfo.model.get('attribution')).toEqual('George Washington');
                expect(this.editMediaInfo.model.get('caption')).toEqual('photo of building');
                expect(this.editMediaInfo.model.get('name')).toEqual('building');
            });
        });
    });
