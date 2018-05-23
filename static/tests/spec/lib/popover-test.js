var rootDir = '../../';
define([
    'jquery',
    rootDir + 'lib/popovers/popover',
    rootDir + "apps/main/views/left/add-marker-menu",
],
    function ($, Popover, AddMarkerMenu) {
        'use strict';

        const initSpies = (scope) => {
            scope.fixture = setFixtures('<div class="body"></div>');
            spyOn(Popover.prototype, 'initialize').and.callThrough();
            spyOn(Popover.prototype, 'onRender').and.callThrough();
            spyOn(Popover.prototype, 'removeHeight').and.callThrough();
            spyOn(Popover.prototype, 'setHeight').and.callThrough();
            spyOn(Popover.prototype, 'createPopper').and.callThrough();
            spyOn(Popover.prototype, 'validate').and.callThrough();
            spyOn(Popover.prototype, 'appendView').and.callThrough();
            spyOn(Popover.prototype, 'show').and.callThrough();
            spyOn(Popover.prototype, 'hideIfValid').and.callThrough();
            spyOn(Popover.prototype, 'hide').and.callThrough();
            spyOn(Popover.prototype, 'resetProperties').and.callThrough();
            spyOn(Popover.prototype, 'update').and.callThrough();
            spyOn(Popover.prototype, 'redraw').and.callThrough();

            spyOn(AddMarkerMenu.prototype, 'initialize');
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
            // it("Initialization params to be set successfully", function () {
            //     initModalComplex(this);
            //     //this.fixture.append(this.modal);
            //     //properties set:
            //     expect(this.modal.width).toEqual('50vw');
            //     expect(this.modal.margin).toEqual('auto');
            //     expect(this.modal.showCloseButton).toBeFalsy();
            //     expect(this.modal.closeButtonText).toEqual('Close');
            //     expect(this.modal.saveButtonText).toEqual('Update');
            //     expect(this.modal.deleteButtonText).toEqual('Remove');
            //     expect(this.modal.printButtonText).toEqual('Make Print');
            //     expect(this.modal.showSaveButton).toBeFalsy();
            //     expect(this.modal.showDeleteButton).toBeFalsy();
            //     expect(this.modal.view).toBeNull();
            //     expect(this.modal.title).toEqual('My Title');
            // });
        });

        // describe("Modal: Renderer Tests", function () {
        //     beforeEach(function () {
        //         initSpies(this);
        //         initDummyView(this);
        //     });
        //     it("Renders controls successfully", function () {
        //         initModalSimple(this);
        //         this.fixture.append(this.modal.$el);
        //         this.modal.update({
        //             width: '50vw',
        //             saveButtonText: 'Update',
        //             deleteButtonText: 'Remove',
        //             printButtonText: 'Make Print',
        //             showSaveButton: true,
        //             showDeleteButton: true,
        //             title: 'My Title',
        //             view: this.dummyView
        //         })
        //         expect(this.fixture).toContainElement('div.content');
        //         expect(this.fixture.find('h1').html()).toEqual('My Title');
        //         expect(this.fixture).toContainElement('div.body');
        //         expect(this.fixture).toContainElement('.save-modal-form');
        //         expect(this.fixture.find('.save-modal-form').html()).toEqual('Update');
        //         expect(this.fixture).toContainElement('.close');
        //         expect(this.fixture).toContainElement('.delete-modal');
        //
        //         //ensure that dummy view form is also in there:
        //         expect(this.fixture.find('#map-name').val()).toEqual('Map 3');
        //         expect(this.fixture.find('#map-caption').val()).toEqual('');
        //     });
        //
        //     /*
        //     'click .save-modal-form': 'saveFunction'
        //     */
        //
        //     it("listens for saveFunction click event", function () {
        //         initModalSimple(this);
        //         this.modal.update({
        //             view: this.dummyView,
        //             saveFunction: this.dummyView.saveMap.bind(this.dummyView),
        //         })
        //         this.fixture.append(this.modal.$el);
        //
        //         expect(EditMapForm.prototype.saveMap).toHaveBeenCalledTimes(0);
        //         this.fixture.find('.save-modal-form').trigger('click');
        //         expect(EditMapForm.prototype.saveMap).toHaveBeenCalledTimes(1);
        //     });
        //
        //     it("listens for deleteFunction click event", function () {
        //         initModalSimple(this);
        //         this.modal.update({
        //             view: this.dummyView,
        //             showDeleteButton: true,
        //             deleteFunction: this.dummyView.saveMap.bind(this.dummyView),
        //             saveFunction: null // just in case
        //         })
        //         this.fixture.append(this.modal.$el);
        //
        //         expect(EditMapForm.prototype.saveMap).toHaveBeenCalledTimes(0);
        //         this.fixture.find('.delete-modal').trigger('click');
        //         expect(EditMapForm.prototype.saveMap).toHaveBeenCalledTimes(1);
        //     });
        //
        //     it("listens for 4 close modal events", function () {
        //         initModalSimple(this);
        //         this.modal.update({
        //             showDeleteButton: false
        //         })
        //         this.fixture.append(this.modal.$el);
        //         expect(Modal.prototype.hide).toHaveBeenCalledTimes(0);
        //         expect(Modal.prototype.hideIfValid).toHaveBeenCalledTimes(0);
        //
        //         //trigger click on background translucent div:
        //         this.fixture.find('.modal').trigger('click');
        //         expect(Modal.prototype.hide).toHaveBeenCalledTimes(1);
        //         expect(Modal.prototype.hideIfValid).toHaveBeenCalledTimes(1);
        //
        //         //trigger click on "x":
        //         this.fixture.find('.close').trigger('click');
        //         expect(Modal.prototype.hide).toHaveBeenCalledTimes(2);
        //         expect(Modal.prototype.hideIfValid).toHaveBeenCalledTimes(2);
        //
        //         //trigger click on Cancel button:
        //         this.fixture.find('.close-modal').trigger('click');
        //         expect(Modal.prototype.hide).toHaveBeenCalledTimes(3);
        //         expect(Modal.prototype.hideIfValid).toHaveBeenCalledTimes(3);
        //
        //         this.app.vent.trigger('close-modal');
        //         expect(Modal.prototype.hide).toHaveBeenCalledTimes(4);
        //         expect(Modal.prototype.hideIfValid).toHaveBeenCalledTimes(3);
        //     });
        //
        // });
        //
        // describe("Modal: Method & Event Tests", function () {
        //     beforeEach(function () {
        //         initSpies(this);
        //         initModalComplex(this);
        //         initDummyView(this);
        //     });
        //     it("update is successful", function () {
        //         initModalSimple(this);
        //         this.fixture.append(this.modal.$el);
        //         this.modal.update({
        //             width: '50vw',
        //             showCloseButton: false,
        //             closeButtonText: 'Close',
        //             saveButtonText: 'Update',
        //             deleteButtonText: 'Remove',
        //             printButtonText: 'Make Print',
        //             showSaveButton: true,
        //             showDeleteButton: false,
        //             title: 'My Title',
        //             view: this.dummyView,
        //             saveFunction: this.dummyView.saveMap.bind(this.dummyView)
        //         })
        //         expect(this.modal.width).toEqual('50vw');
        //         expect(this.modal.margin).toEqual('auto');
        //         expect(this.modal.showCloseButton).toBeFalsy();
        //         expect(this.modal.closeButtonText).toEqual('Close');
        //         expect(this.modal.saveButtonText).toEqual('Update');
        //         expect(this.modal.deleteButtonText).toEqual('Remove');
        //         expect(this.modal.printButtonText).toEqual('Make Print');
        //         expect(this.modal.showSaveButton).toBeTruthy();
        //         expect(this.modal.showDeleteButton).toBeFalsy();
        //         expect(this.modal.view).toEqual(this.dummyView);
        //         expect(this.modal.title).toEqual('My Title');
        //     });
        // });
    });
