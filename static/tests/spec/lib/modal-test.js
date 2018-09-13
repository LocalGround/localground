var rootDir = '../../';
define([
    'jquery',
    rootDir + 'lib/modals/modal',
    rootDir + 'lib/editor-views/edit-map-form'
],
    function ($, Modal, EditMapForm) {
        'use strict';

        const initSpies = (scope) => {
            scope.fixture = setFixtures('<div class="body"></div>');
            spyOn(Modal.prototype, 'initialize').and.callThrough();
            spyOn(Modal.prototype, 'render').and.callThrough();
            spyOn(Modal.prototype, 'appendView').and.callThrough();
            spyOn(Modal.prototype, 'attachEvents').and.callThrough();
            spyOn(Modal.prototype, 'update').and.callThrough();
            spyOn(Modal.prototype, 'updateSaveButton').and.callThrough();
            spyOn(Modal.prototype, 'setSize').and.callThrough();
            spyOn(Modal.prototype, 'createModal').and.callThrough();
            spyOn(Modal.prototype, 'show').and.callThrough();
            spyOn(Modal.prototype, 'hideIfValid').and.callThrough();
            spyOn(Modal.prototype, 'hide').and.callThrough();

            spyOn(EditMapForm.prototype, 'saveMap');
        };
        const initModalSimple = (scope) => {
            scope.modal = new Modal({
                app: scope.app
            });
        };
        const initModalComplex = (scope) => {
            scope.modal = new Modal({
                app: scope.app,
                width: '50vw',
                showCloseButton: false,
                closeButtonText: 'Close',
                saveButtonText: 'Update',
                deleteButtonText: 'Remove',
                printButtonText: 'Make Print',
                showSaveButton: false,
                showDeleteButton: false,
                title: 'My Title'
            });
        };
        const initDummyView = (scope) => {
            scope.dummyView = new EditMapForm({
                app: scope.app,
                model: scope.map
            });
            scope.dummyView.render();
        };

        describe("Modal: Initialization Tests", function () {
            beforeEach(function () {
                initSpies(this);
            });

            it("Initialization called successfully", function () {
                initModalSimple(this);
                //functions called:
                expect(Modal.prototype.initialize).toHaveBeenCalledTimes(1);
                expect(Modal.prototype.attachEvents).toHaveBeenCalledTimes(1);
                //properties set:
                expect(this.modal.width).toEqual('90vw');
                expect(this.modal.margin).toEqual('auto');
                expect(this.modal.showCloseButton).toBeTruthy();
                expect(this.modal.closeButtonText).toEqual('Cancel');
                expect(this.modal.saveButtonText).toEqual('Save');
                expect(this.modal.deleteButtonText).toEqual('Delete');
                expect(this.modal.printButtonText).toEqual('Print');
                expect(this.modal.showSaveButton).toBeTruthy();
                expect(this.modal.showDeleteButton).toBeTruthy();
                expect(this.modal.view).toBeNull();
                expect(this.modal.title).toBeNull();
            });
            it("Initialization params to be set successfully", function () {
                initModalComplex(this);
                //this.fixture.append(this.modal);
                //properties set:
                expect(this.modal.width).toEqual('50vw');
                expect(this.modal.margin).toEqual('auto');
                expect(this.modal.showCloseButton).toBeFalsy();
                expect(this.modal.closeButtonText).toEqual('Close');
                expect(this.modal.saveButtonText).toEqual('Update');
                expect(this.modal.deleteButtonText).toEqual('Remove');
                expect(this.modal.printButtonText).toEqual('Make Print');
                expect(this.modal.showSaveButton).toBeFalsy();
                expect(this.modal.showDeleteButton).toBeFalsy();
                expect(this.modal.view).toBeNull();
                expect(this.modal.title).toEqual('My Title');
            });
        });

        describe("Modal: Renderer Tests", function () {
            beforeEach(function () {
                initSpies(this);
                initDummyView(this);
            });
            it("Renders controls successfully", function () {
                initModalSimple(this);
                this.fixture.append(this.modal.$el);
                this.modal.update({
                    width: '50vw',
                    saveButtonText: 'Update',
                    deleteButtonText: 'Remove',
                    printButtonText: 'Make Print',
                    showSaveButton: true,
                    showDeleteButton: true,
                    title: 'My Title',
                    view: this.dummyView
                })
                expect(this.fixture).toContainElement('div.content');
                expect(this.fixture.find('h1').html()).toEqual('My Title');
                expect(this.fixture).toContainElement('div.body');
                expect(this.fixture).toContainElement('.save-modal-form');
                expect(this.fixture.find('.save-modal-form').html()).toEqual('Update');
                expect(this.fixture).toContainElement('.close');
                expect(this.fixture).toContainElement('.delete-modal');

                //ensure that dummy view form is also in there:
                expect(this.fixture.find('#map-name').val()).toEqual('Map 3');
                expect(this.fixture.find('#map-caption').val()).toEqual('');
            });

            /*
            'click .save-modal-form': 'saveFunction'
            */

            it("listens for saveFunction click event", function () {
                initModalSimple(this);
                this.modal.update({
                    view: this.dummyView,
                    saveFunction: this.dummyView.saveMap.bind(this.dummyView),
                })
                this.fixture.append(this.modal.$el);

                expect(EditMapForm.prototype.saveMap).toHaveBeenCalledTimes(0);
                this.fixture.find('.save-modal-form').trigger('click');
                expect(EditMapForm.prototype.saveMap).toHaveBeenCalledTimes(1);
            });

            it("listens for deleteFunction click event", function () {
                initModalSimple(this);
                this.modal.update({
                    view: this.dummyView,
                    showDeleteButton: true,
                    deleteFunction: this.dummyView.saveMap.bind(this.dummyView),
                    saveFunction: null // just in case
                })
                this.fixture.append(this.modal.$el);

                expect(EditMapForm.prototype.saveMap).toHaveBeenCalledTimes(0);
                this.fixture.find('.delete-modal').trigger('click');
                expect(EditMapForm.prototype.saveMap).toHaveBeenCalledTimes(1);
            });

            it("listens for 4 close modal events", function () {
                initModalSimple(this);
                this.modal.update({
                    showDeleteButton: false
                })
                this.fixture.append(this.modal.$el);
                expect(Modal.prototype.hide).toHaveBeenCalledTimes(0);
                expect(Modal.prototype.hideIfValid).toHaveBeenCalledTimes(0);

                //trigger click on background translucent div:
                this.fixture.find('.modal').trigger('click');
                expect(Modal.prototype.hide).toHaveBeenCalledTimes(1);
                expect(Modal.prototype.hideIfValid).toHaveBeenCalledTimes(1);

                //trigger click on "x":
                this.fixture.find('.close').trigger('click');
                expect(Modal.prototype.hide).toHaveBeenCalledTimes(2);
                expect(Modal.prototype.hideIfValid).toHaveBeenCalledTimes(2);

                //trigger click on Cancel button:
                this.fixture.find('.close-modal').trigger('click');
                expect(Modal.prototype.hide).toHaveBeenCalledTimes(3);
                expect(Modal.prototype.hideIfValid).toHaveBeenCalledTimes(3);

                this.app.vent.trigger('close-modal');
                expect(Modal.prototype.hide).toHaveBeenCalledTimes(4);
                expect(Modal.prototype.hideIfValid).toHaveBeenCalledTimes(3);
            });

        });

        describe("Modal: Method & Event Tests", function () {
            beforeEach(function () {
                initSpies(this);
                initModalComplex(this);
                initDummyView(this);
            });
            it("update is successful", function () {
                initModalSimple(this);
                this.fixture.append(this.modal.$el);
                this.modal.update({
                    width: '50vw',
                    showCloseButton: false,
                    closeButtonText: 'Close',
                    saveButtonText: 'Update',
                    deleteButtonText: 'Remove',
                    printButtonText: 'Make Print',
                    showSaveButton: true,
                    showDeleteButton: false,
                    title: 'My Title',
                    view: this.dummyView,
                    saveFunction: this.dummyView.saveMap.bind(this.dummyView)
                })
                expect(this.modal.width).toEqual('50vw');
                expect(this.modal.margin).toEqual('auto');
                expect(this.modal.showCloseButton).toBeFalsy();
                expect(this.modal.closeButtonText).toEqual('Close');
                expect(this.modal.saveButtonText).toEqual('Update');
                expect(this.modal.deleteButtonText).toEqual('Remove');
                expect(this.modal.printButtonText).toEqual('Make Print');
                expect(this.modal.showSaveButton).toBeTruthy();
                expect(this.modal.showDeleteButton).toBeFalsy();
                expect(this.modal.view).toEqual(this.dummyView);
                expect(this.modal.title).toEqual('My Title');
            });
        });
    });
