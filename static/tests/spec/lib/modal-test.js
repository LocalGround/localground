var rootDir = '../../';
define([
    'jquery',
    rootDir + 'lib/modals/modal',
    rootDir + 'apps/main/views/left/edit-map-form'
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
            scope.dummyView = new EditMapForm({
                app: scope.app,
                model: scope.map
            });
            scope.dummyView.render();
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
                initModalComplex(this);
            });
            it("Renders controls successfully", function () {
                initModalSimple(this);
                this.fixture.append(this.modal.$el);
                this.modal.update({
                    width: '50vw',
                    closeButtonText: 'Close',
                    saveButtonText: 'Update',
                    deleteButtonText: 'Remove',
                    printButtonText: 'Make Print',
                    showSaveButton: true,
                    showDeleteButton: true,
                    title: 'My Title',
                    view: this.dummyView
                })
                expect(this.fixture).toContainElement('div.content');
                console.log(this.fixture.find('div.content').css('width'));
                expect(this.fixture).toContainElement('div.body');
                expect(this.fixture).toContainElement('.save-modal-form');
                expect(this.fixture).toContainElement('.close');
                expect(this.fixture).toContainElement('.delete-modal');
            });
        });

        describe("Modal: Method Tests", function () {
            beforeEach(function () {
                initSpies(this);
                initModalComplex(this);
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

                expect(EditMapForm.prototype.saveMap).toHaveBeenCalledTimes(0);
                this.fixture.find('.save-modal-form').trigger('click');
                expect(EditMapForm.prototype.saveMap).toHaveBeenCalledTimes(1);
            });
        });
    });
