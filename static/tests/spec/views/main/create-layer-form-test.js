var rootDir = "../../../";
define([
    "backbone",
    rootDir + "apps/main/views/left/create-layer-form",
    rootDir + "lib/modals/modal",
    "tests/spec-helper1"
],
    function (Backbone, CreateLayerForm, Modal) {
        'use strict';
        var map;

        const initView = function (scope) {
            spyOn(CreateLayerForm.prototype, 'initialize').and.callThrough();
            spyOn(CreateLayerForm.prototype, 'toggleCheckboxes').and.callThrough();

            spyOn(Modal.prototype, 'show').and.callThrough();
            spyOn(Modal.prototype, 'update').and.callThrough();
            spyOn(scope.app.vent, 'trigger');

            map = scope.dataManager.getMaps().at(0);
            map.set("layers", scope.getLayers(map.id));

            scope.view = new CreateLayerForm({
                app: scope.app,
                model: map
            });
        };

        describe("CreateLayerForm: initialization: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize correctly", function () {
                expect(this.view.initialize).toHaveBeenCalledTimes(1);
                expect(this.view.model).toEqual(map);
                //expect(this.view.collection.length).toEqual(1);
            });
        });

        describe("CreateLayerForm: UI rendering / listening works: ", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should listen for user's dataset selections", function () {
                this.view.render();
                expect(this.view.toggleCheckboxes).toHaveBeenCalledTimes(0);
                expect(this.view.$el.find('#dataset-list').attr('disabled')).toBeUndefined();

                //user asks for a map with a new dataset:
                this.view.$el.find('#layer-new-dataset').trigger('click');
                expect(this.view.$el.find('#dataset-list').attr('disabled')).toEqual('disabled');
                expect(this.view.toggleCheckboxes).toHaveBeenCalledTimes(1);

                //user asks for a map with one or more existing datasets:
                this.view.$el.find('#layer-existing-datasets').trigger('click');
                expect(this.view.$el.find('#dataset-list').attr('disabled')).toBeUndefined();
                expect(this.view.toggleCheckboxes).toHaveBeenCalledTimes(2);
            });

            it("should have all form elements", function () {
                this.view.render();
                const $el = this.view.$el;
                expect($el.find('#layer-title').val()).toEqual('Layer Title');
                expect($el.find('#layer-new-dataset').prop('checked')).toBeFalsy()
                expect($el.find('#layer-existing-datasets').attr('disabled')).toBeUndefined();
                expect($el.find('#dataset-list').attr('disabled')).toBeUndefined();
                this.app.dataManager.getDatasets().forEach(dataset => {
                    expect($el.find('option[value=' + dataset.formID + ']').val()).toEqual(dataset.formID.toString());
                });
            });

            /*
            <div class="form">
                <div class="row">
                    <label>Layer Title: </label>
                    <input id="layer-title" type="text" placeholder="Layer Title">
                </div>

                <div class="row">
                    <input type="radio" name="choose-dataset" id="layer-new-dataset">
                    <label>Create a new dataset</label>
                </div>
                <div class="row">
                    <input type="radio" name="choose-dataset" id="layer-existing-datasets" checked>
                    <label>Use existing project dataset:</label>
                </div>
                <div class="row">
                    <select id="dataset-list">
                        {{#each datasets}}
                            <option value="{{this.formID}}">{{this.title}}</option>
                        {{/each}}
                    <select>
                </div>
            </div>

            */

        });
    });
