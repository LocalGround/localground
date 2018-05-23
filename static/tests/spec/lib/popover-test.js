var rootDir = '../../';
define([
    'jquery',
    rootDir + 'lib/popovers/popover',
    rootDir + "apps/main/views/left/add-marker-menu",
],
    function ($, Popover, AddMarkerMenu) {
        'use strict';
        let fixture;
        const initSpies = (scope) => {
            scope.fixture = setFixtures('<div class="body"></div>');
            spyOn(Popover.prototype, '_removeHeight').and.callThrough();
            spyOn(Popover.prototype, '_setHeight').and.callThrough();
            spyOn(Popover.prototype, '_createPopper').and.callThrough();
            spyOn(Popover.prototype, '_validate').and.callThrough();
            spyOn(Popover.prototype, '_hideIfValid').and.callThrough();
            spyOn(Popover.prototype, '_resetProperties').and.callThrough();
            spyOn(Popover.prototype, 'initialize').and.callThrough();
            spyOn(Popover.prototype, 'onRender').and.callThrough();
            spyOn(Popover.prototype, '_appendView').and.callThrough();
            spyOn(Popover.prototype, 'show').and.callThrough();
            spyOn(Popover.prototype, 'hide').and.callThrough();
            spyOn(Popover.prototype, 'update').and.callThrough();
            spyOn(Popover.prototype, 'redraw').and.callThrough();

            spyOn(AddMarkerMenu.prototype, 'initialize');
            fixture = setFixtures('<button id="showPopover">Show</button>')
        };
        const initView = (scope) => {
            scope.popover = new Popover({
                app: scope.app
            });
            scope.childView = new AddMarkerMenu({
                app: scope.app,
                model: scope.getRecord()
            });
        };

        describe("Popover: Initialization Tests", function () {
            beforeEach(function () {
                initSpies(this);
                initView(this);
            });

            it("Initialization called successfully", function () {
                //functions called:
                expect(Popover.prototype.initialize).toHaveBeenCalledTimes(1);
            });

            it("Listens for close events", function () {
                this.popover.update({
                    $source: $('#showPopover'),
                    view: this.childView,
                    title: 'Test Popover'
                });
                expect(Popover.prototype.hide).toHaveBeenCalledTimes(0);
                expect(Popover.prototype._hideIfValid).toHaveBeenCalledTimes(0);

                //click background to close:
                this.popover.$el.find('.popover').trigger('click');
                expect(Popover.prototype.hide).toHaveBeenCalledTimes(1);
                expect(Popover.prototype._hideIfValid).toHaveBeenCalledTimes(1);

                //click close button to close:
                this.popover.$el.find('.close').trigger('click');
                expect(Popover.prototype.hide).toHaveBeenCalledTimes(2);
                expect(Popover.prototype._hideIfValid).toHaveBeenCalledTimes(2);

                //trigger remotely from another view:
                this.app.vent.trigger('hide-popover');
                expect(Popover.prototype.hide).toHaveBeenCalledTimes(3);
                expect(Popover.prototype._hideIfValid).toHaveBeenCalledTimes(2);
            });


        });
        describe("Popover: Update Tests", function () {

        });

    });
