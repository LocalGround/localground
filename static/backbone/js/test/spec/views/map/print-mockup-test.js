define(["views/prints/printMockup",
        "../../../../test/spec-helper"],
    function (PrintMockup) {
        'use strict';
        var printMockup,
            printMockupOpts;

        function getPrintMockupParams() {
            return {
                availableProjects: this.projectsLite,
                controller: {
                    trigger: function (event, argument) {
                        if (this.registeredEvents && this.registeredEvents[event]) {
                            this.registeredEvents[event](argument);
                        }
                    }
                },
                app: this.app
            };
        }

        function initPrintMockup(printMockupOpts) {
            //I'm mocking listenTo here to test layoutChange and allow the constructor to
            //accept the mock controller, but note this may break
            //some basic marionette functionality that depends on the method later
            spyOn(PrintMockup.prototype, 'listenTo').and.callFake(function (object, event, callback) {
                if (object) {
                    if (!object.registeredEvents) {
                        object.registeredEvents = {};
                    }
                    object.registeredEvents[event] = callback.bind(this);
                }
            });
            return new PrintMockup(printMockupOpts);

        }

        describe("Print Mockup:", function () {

            it("Initializes correctly when loaded with valid parameters", function () {
                var that = this;
                expect(function () {
                    initPrintMockup.call(that, getPrintMockupParams.call(that));
                }).not.toThrow();
            });

            it('Correctly responds to changeLayout', function () {
                spyOn(PrintMockup.prototype, 'changeLayout').and.callThrough();
                printMockupOpts = getPrintMockupParams.call(this);
                printMockup = initPrintMockup.call(this, printMockupOpts);

                printMockupOpts.controller.trigger('change-layout', 'portrait');
                expect(printMockup.changeLayout).toHaveBeenCalled();
                expect(printMockup.el.className).toEqual('portrait');
            });

            describe("Functionality:", function () {

                //Using this rather than beforeEach so that I can register specific
                //spies before event binding occurs.  Apologies for the extra complexity
                function initMockup () {
                    printMockupOpts = getPrintMockupParams.call(this);
                    printMockup = initPrintMockup.call(this, printMockupOpts);
                    window.setFixtures(printMockup.render().$el);
                };

                it("Title input toggles with title when title is clicked", function () {
                    spyOn(PrintMockup.prototype,'showTitleInput').and.callThrough();
                    initMockup.call(this);
                    expect(printMockup.ui.title.css('display')).toEqual('block');
                    expect(printMockup.ui.titleInput.css('display')).toEqual('none');
                    printMockup.ui.title.click();
                    expect(printMockup.showTitleInput).toHaveBeenCalled();
                    expect(printMockup.ui.title.css('display')).toEqual('none');
                    expect(printMockup.ui.titleInput.css('display')).toEqual('inline-block');

                });

                it('Title input is hidden when unfocused', function () {
                    spyOn(PrintMockup.prototype,'hideTitleInput').and.callThrough();
                    initMockup.call(this);
                    printMockup.ui.title.click();
                    expect(printMockup.ui.titleInput.css('display')).toEqual('inline-block');
                    printMockup.ui.titleInput.blur();
                    expect(printMockup.hideTitleInput).toHaveBeenCalled();
                    expect(printMockup.ui.titleInput.css('display')).toEqual('none');

                });

                it('Instruction input toggles when clicked', function () {
                    spyOn(PrintMockup.prototype,'showCaptionInput').and.callThrough();
                    initMockup.call(this);
                    expect(printMockup.ui.caption.css('display')).toEqual('block');
                    expect(printMockup.ui.captionInput.css('display')).toEqual('none');
                    printMockup.ui.caption.click();
                    expect(printMockup.showCaptionInput).toHaveBeenCalled();
                    expect(printMockup.ui.caption.css('display')).toEqual('none');
                    expect(printMockup.ui.captionInput.css('display')).toEqual('block');
                });

                it('Instruction input is hidden when unfocused', function () {
                    spyOn(PrintMockup.prototype,'hideCaptionInput').and.callThrough();
                    initMockup.call(this);
                    printMockup.ui.caption.click();
                    expect(printMockup.ui.captionInput.css('display')).toEqual('block');
                    printMockup.ui.captionInput.blur();
                    expect(printMockup.hideCaptionInput).toHaveBeenCalled();
                    expect(printMockup.ui.captionInput.css('display')).toEqual('none');
                });

                it('Correctly replaces title text', function () {
                    initMockup.call(this);
                    expect(printMockup.ui.title.text()).toEqual('Click to enter a map title');
                    expect(printMockup.getTitle()).toEqual('');
                    printMockup.ui.title.click();
                    printMockup.ui.titleInput.val('Test Title');
                    printMockup.ui.titleInput.blur();
                    expect(printMockup.ui.title.text()).toEqual('Test Title');
                    expect(printMockup.getTitle()).toEqual('Test Title');
                });

                it('Correctly replaces instruction text', function() {
                    initMockup.call(this);
                    expect(printMockup.ui.caption.text()).toEqual('Click to enter instructions...');
                    expect(printMockup.getInstructions()).toEqual('');
                    printMockup.ui.caption.click();
                    printMockup.ui.captionInput.val('Test Instructions');
                    printMockup.ui.captionInput.blur();
                    expect(printMockup.ui.caption.text()).toEqual('Test Instructions');
                    expect(printMockup.getInstructions()).toEqual('Test Instructions');
                });

            });

        });


    });