var rootDir = "../../../";
define([
    "backbone",
    rootDir + "models/map",
    rootDir + "apps/main/views/presentation-options",
    rootDir + "apps/main/views/edit-title-card"
],
    function (Backbone, Map, PresentationOptions, EditTitleCard) {
        'use strict';
        const initTitleCardMenu = function (scope) {

            // 1) add spies for all relevant objects:
            spyOn(PresentationOptions.prototype, 'initialize').and.callThrough();
            spyOn(PresentationOptions.prototype, 'render').and.callThrough();
            spyOn(PresentationOptions.prototype, 'updateDisplayLegend').and.callThrough();

            spyOn(Map.prototype, 'save');

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

            it("updateDisplayLegend()", function() {
                expect(Map.prototype.save).toHaveBeenCalledTimes(0);
                this.presentationOptions.$el.find('#display-legend').prop( "checked", false ).click();
                expect(this.presentationOptions.activeMap.get('metadata').displayLegend).toEqual(false);
                expect(Map.prototype.save).toHaveBeenCalledTimes(1);this.presentationOptions.$el.find('#display-legend').click();
                expect(this.presentationOptions.activeMap.get('metadata').displayLegend).toEqual(true);
                expect(Map.prototype.save).toHaveBeenCalledTimes(2);    
                this.presentationOptions.$el.find('#display-legend').click();
                expect(this.presentationOptions.activeMap.get('metadata').displayLegend).toEqual(false);
                expect(Map.prototype.save).toHaveBeenCalledTimes(3);    
            });

            it("updateNextPrev()", function() {
                expect(Map.prototype.save).toHaveBeenCalledTimes(0);
                this.presentationOptions.$el.find('#next-prev').prop( "checked", false ).click();
                expect(this.presentationOptions.activeMap.get('metadata').nextPrevButtons).toEqual(false);
                expect(Map.prototype.save).toHaveBeenCalledTimes(1);
                this.presentationOptions.$el.find('#next-prev').click();
                expect(this.presentationOptions.activeMap.get('metadata').nextPrevButtons).toEqual(true); 
                expect(Map.prototype.save).toHaveBeenCalledTimes(2);   
                this.presentationOptions.$el.find('#next-prev').click();
                expect(this.presentationOptions.activeMap.get('metadata').nextPrevButtons).toEqual(false);
                expect(Map.prototype.save).toHaveBeenCalledTimes(3);    
            });

            it("updatePanZoom()", function() {
                expect(Map.prototype.save).toHaveBeenCalledTimes(0);
                this.presentationOptions.$el.find('#pan-zoom').prop( "checked", false ).click();
                expect(this.presentationOptions.activeMap.get('metadata').allowPanZoom).toEqual(false);
                expect(Map.prototype.save).toHaveBeenCalledTimes(1);
                this.presentationOptions.$el.find('#pan-zoom').click();
                expect(this.presentationOptions.activeMap.get('metadata').allowPanZoom).toEqual(true);
                expect(Map.prototype.save).toHaveBeenCalledTimes(2);    
                this.presentationOptions.$el.find('#pan-zoom').click();
                expect(this.presentationOptions.activeMap.get('metadata').allowPanZoom).toEqual(false);
                expect(Map.prototype.save).toHaveBeenCalledTimes(3);    
            });

            it("updateStreetView()", function() {
                expect(Map.prototype.save).toHaveBeenCalledTimes(0);
                this.presentationOptions.$el.find('#street-view').prop( "checked", false ).click();
                expect(this.presentationOptions.activeMap.get('metadata').streetview).toEqual(false);
                expect(Map.prototype.save).toHaveBeenCalledTimes(1);
                this.presentationOptions.$el.find('#street-view').click();
                expect(this.presentationOptions.activeMap.get('metadata').streetview).toEqual(true);
                expect(Map.prototype.save).toHaveBeenCalledTimes(2);    
                this.presentationOptions.$el.find('#street-view').click();
                expect(this.presentationOptions.activeMap.get('metadata').streetview).toEqual(false);
                expect(Map.prototype.save).toHaveBeenCalledTimes(3);    
            });
            it("updateTitleCardDisplay()", function() {
                expect(Map.prototype.save).toHaveBeenCalledTimes(0);
                this.presentationOptions.$el.find('#title-card').prop( "checked", false ).click();
                expect(this.presentationOptions.activeMap.get('metadata').displayTitleCard).toEqual(false);
                expect(Map.prototype.save).toHaveBeenCalledTimes(1);
                this.presentationOptions.$el.find('#title-card').click();
                expect(this.presentationOptions.activeMap.get('metadata').displayTitleCard).toEqual(true);
                expect(Map.prototype.save).toHaveBeenCalledTimes(2);    
                this.presentationOptions.$el.find('#title-card').click();
                expect(this.presentationOptions.activeMap.get('metadata').displayTitleCard).toEqual(false);
                expect(Map.prototype.save).toHaveBeenCalledTimes(3);    
            });
        });
    });
