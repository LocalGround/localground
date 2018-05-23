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
            spyOn(Popover.prototype, '_appendView').and.callThrough();
            spyOn(Popover.prototype, '_show').and.callThrough();
            spyOn(Popover.prototype, '_destroyPopper').and.callThrough();
            spyOn(Popover.prototype, 'initialize').and.callThrough();
            spyOn(Popover.prototype, 'onRender').and.callThrough();
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
            beforeEach(function () {
                initSpies(this);
                initView(this);
            });

            afterEach(function () {
                $('.popover').remove();
            });

            it("Throws error if no $source", function () {
                expect(() => {
                    this.popover.update({
                        view: this.childView,
                        title: 'Test Popover'
                    })
                }).toThrow(new Error('$source element is required'));
            });

            it("Throws error if no view", function () {
                expect(() => {
                    this.popover.update({
                        $source: $('#showPopover'),
                        title: 'Test Popover'
                    })
                }).toThrow(new Error('a view is required'));
            });

            it("sets all flags when update options passed in", function () {
                this.popover.update({
                    $source: $('#showPopover'),
                    view: this.childView,
                    title: 'Test Popover',
                    width: '400px',
                    offsetX: '20px',
                    offsetY: '50px',
                    placement: 'top',
                    includeArrow: false
                });
                expect(this.popover.title).toEqual('Test Popover');
                expect(this.popover.width).toEqual('400px');
                expect(this.popover.offsetX).toEqual('20px');
                expect(this.popover.offsetY).toEqual('50px');
                expect(this.popover.placement).toEqual('top');
                expect(this.popover.includeArrow).toBeFalsy();
            });

            it("sets all flags when update options passed in", function () {
                this.popover.update({
                    view: this.childView,
                    $source: $('#showPopover')
                });
                this.popover.redraw({
                    title: 'Test Popover',
                    width: '400px',
                    offsetX: '20px',
                    offsetY: '50px',
                    placement: 'top',
                    includeArrow: false
                });
                expect(this.popover.title).toEqual('Test Popover');
                expect(this.popover.width).toEqual('400px');
                expect(this.popover.offsetX).toEqual('20px');
                expect(this.popover.offsetY).toEqual('50px');
                expect(this.popover.placement).toEqual('top');
                expect(this.popover.includeArrow).toBeFalsy();
            });

            it("Renders the view contents inside the body", function () {
                this.popover.update({
                    $source: $('#showPopover'),
                    view: this.childView,
                    title: 'Test Popover'
                });
                expect(this.popover.$el).toContainElement('.body');
                expect(this.popover.$el.find('.body > div').html()).toEqual(
                    this.childView.$el.html());
                expect(this.popover.$el.find('.body')).toContainElement(
                    '.geometry-list-wrapper');
            });

            it("Renders a title if requested", function () {
                this.popover.update({
                    $source: $('#showPopover'),
                    view: this.childView,
                    title: 'Test Popover'
                });
                expect(this.popover.$el).toContainElement('header');
                expect(this.popover.$el).toContainElement('span.close.right');
                expect(this.popover.$el).toContainElement('h3');
                expect(this.popover.$el.find('h3')).toContainText('Test Popover');
                expect(this.popover.$el).toContainElement('.popper__arrow');
            });

            it("Does not render a title if not requested", function () {
                this.popover.update({
                    $source: $('#showPopover'),
                    view: this.childView,
                });
                expect(this.popover.$el).not.toContainElement('header');
                expect(this.popover.$el).not.toContainElement('span.close.right');
                expect(this.popover.$el).not.toContainElement('h3');
                expect(this.popover.$el.find('h3')).not.toContainText('Test Popover');
                expect(this.popover.$el).toContainElement('.popper__arrow');
            });

            it("Does not render an arrow if requested", function () {
                this.popover.update({
                    $source: $('#showPopover'),
                    view: this.childView,
                    includeArrow: false
                });
                expect(this.popover.$el).not.toContainElement('.popper__arrow');
            });
        });

    });
