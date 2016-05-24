define(["views/maps/sidepanel/uploadModal",
        "views/maps/sidepanel/dataPanel",
        "../../../../test/spec-helper"],
    function (UploadModal, DataPanel) {
        'use strict';

        describe("UploadModalToggling", function () {
            var dataPanel, uploadModal;

            beforeEach(function () {
                dataPanel = new DataPanel({app: this.app});
                dataPanel.render();
                window.setFixtures(dataPanel.render().$el);
                dataPanel.uploadModalWrapper.show(new UploadModal({url: '/upload/embed', app: this.app}));
                uploadModal = dataPanel.uploadModalWrapper.currentView;

            });

            it("Calls showModal when upload button is clicked", function () {
                spyOn(uploadModal, 'showModal');

                dataPanel.$el.find('#upload').click();
                expect(uploadModal.showModal).toHaveBeenCalled();
            });

            it("Calls cleanup function when close modal is triggered", function () {
                spyOn(uploadModal, 'cleanUp');
                spyOn(uploadModal, 'showModal');
                uploadModal.render();
                dataPanel.$el.find('#upload').click();
                uploadModal.ui.modal.trigger('hidden.bs.modal');

                expect(uploadModal.cleanUp).toHaveBeenCalled();
            });

            it("Triggers collection refresh after closing upload modal", function () {
                spyOn(this.app.vent, 'trigger');
                spyOn(uploadModal, 'showModal');
                uploadModal.render();
                dataPanel.$el.find('#upload').click();
                uploadModal.ui.modal.trigger('hidden.bs.modal');

                expect(this.app.vent.trigger).toHaveBeenCalledWith('refresh-collections');
            });


        });


    });