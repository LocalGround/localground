var rootDir = "../../";
define([
    "handlebars",
    rootDir + "apps/gallery/views/create-form",
    rootDir + "models/form",
    "tests/spec-helper"
],
    function (Handlebars, CreateForm, Form) {
        'use strict';
        var fixture;
        var newCreateForm;

        /*function initChildView(scope) {
            var opts = {
                    "title": "6 - 10",
                    "strokeWeight": 1,
                    "rule": "earthworm_count > 5 and earthworm_count < 11",
                    "height": 32,
                    "width": 32,
                    "shape": "worm",
                    "strokeColor": "#FFF",
                    "color": "#df65b0",
                    "is_showing": true
                },
                childView = new LegendSymbolEntry({
                    app: scope.app,
                    data_source: 'form_1',
                    model: new Symbol(opts)
                });
            childView.render();
            return childView;
        }

        function initCreate Form(scope) {
            spyOn(LegendSymbolEntry.prototype, 'initialize').and.callThrough();
            spyOn(LegendSymbolEntry.prototype, 'showHide').and.callThrough();
            spyOn(OverlayListView.prototype, 'showAll');
            spyOn(OverlayListView.prototype, 'hideAll');
            spyOn(OverlayListView.prototype, 'initialize');
            lle = new Create Form({
                app: scope.app,
                model: scope.layer
            });
            lle.render();
        }
        */

        var initSpies = function () {
            spyOn(CreateForm.prototype, 'render').and.callThrough();
            spyOn(CreateForm.prototype, 'initModel').and.callThrough();
        };

        describe("Create Form: Initialization Tests", function () {
            beforeEach(function () {
                initSpies();
            });



            it("Form Successfully created", function () {
                newCreateForm = new CreateForm();
                expect(newCreateForm.model).toEqual(jasmine.any(Form));
                expect(CreateForm.prototype.initModel).toHaveBeenCalledTimes(0);
            });

            it("Template is created", function () {
                //console.log(newCreateForm.template);
                newCreateForm = new CreateForm();
                expect(newCreateForm.template).toEqual(jasmine.any(Function));
            });

            it("Render function called", function () {
                newCreateForm = new CreateForm();
                expect(CreateForm.prototype.render).toHaveBeenCalledTimes(1);
            });

            it("No Model defined, make new model", function(){
                newCreateForm = new CreateForm({
                    model: this.form
                });
                expect(CreateForm.prototype.initModel).toHaveBeenCalledTimes(1);
            });
        });

        describe("Create Form: Initialize model", function() {
            beforeEach(function () {
                initSpies();
                newCreateForm = new CreateForm({
                    model: this.form
                });
            });

            it("Put fields into collection", function(){
                console.log(newCreateForm.collection);
                expect(newCreateForm.collection).toEqual(newCreateForm.model.fields);
                expect(newCreateForm.collection.length).toEqual(3);
            });
        });
    });
