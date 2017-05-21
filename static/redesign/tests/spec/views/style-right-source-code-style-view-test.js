var rootDir = "../../";
define([
    rootDir + "apps/style/views/right/source-code-style-view",
    rootDir + "models/layer"
],
    function (SourceCodeStyleView, Layer) {
        'use strict';
        var sourceCodeStyleView,
            fixture,
            initView = function (scope) {
                // 1) add spies for all relevant objects:
                spyOn(window, 'alert');
                spyOn(Layer.prototype, 'set').and.callThrough();
                spyOn(Layer.prototype, 'trigger').and.callThrough();
                spyOn(SourceCodeStyleView.prototype, 'initialize').and.callThrough();
                spyOn(SourceCodeStyleView.prototype, 'render').and.callThrough();
                spyOn(SourceCodeStyleView.prototype, 'trackChanges').and.callThrough();
                spyOn(SourceCodeStyleView.prototype, 'updateModel').and.callThrough();
                fixture = setFixtures('<div></div>');

                // 2) initialize rightPanel object:
                sourceCodeStyleView = new SourceCodeStyleView({
                    app: scope.app,
                    model: scope.layer
                });
                sourceCodeStyleView.render();

                // 3) set fixture:
                fixture.append(sourceCodeStyleView.$el);
            };

        describe("When SourceCodeStyleView is initialized, it...", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should work", function () {
                expect(sourceCodeStyleView).toEqual(jasmine.any(SourceCodeStyleView));
                expect(sourceCodeStyleView.initialize).toHaveBeenCalledTimes(1);
            });

            it("should have correct html", function () {
                expect(fixture.find("h5").html()).toEqual("Marker Style");
                expect(fixture).toContainElement('.toggle-buttons');
                expect(fixture.find("a.style-basic-tab").html()).toEqual("Basic");
                expect(fixture.find("a.style-basic-tab").parent().hasClass("active")).toBeFalsy();
                expect(fixture.find("a.style-source-tab").html()).toEqual("Source Code");
                expect(fixture.find("a.style-source-tab").parent().hasClass("active")).toBeTruthy();
                expect(fixture.find("textarea.source-code").val()).toEqual(JSON.stringify(this.layer.getSymbolsJSON(), null, 3));
            });

            it("sets model correctly", function () {
                expect(sourceCodeStyleView.model).toEqual(this.layer);
            });

            it("calls render() when onShow() called", function () {
                expect(SourceCodeStyleView.prototype.render).toHaveBeenCalledTimes(1);
                sourceCodeStyleView.onShow();
                expect(SourceCodeStyleView.prototype.render).toHaveBeenCalledTimes(2);
            });
        });

        describe("User interaction tests", function () {
            beforeEach(function () {
                initView(this);
            });

            it("calls track changes when user edits textares", function () {
                expect(SourceCodeStyleView.prototype.trackChanges).toHaveBeenCalledTimes(0);
                expect(SourceCodeStyleView.prototype.updateModel).toHaveBeenCalledTimes(0);
                fixture.find("textarea.source-code").trigger('input');
                expect(SourceCodeStyleView.prototype.trackChanges).toHaveBeenCalledTimes(1);
                fixture.find("textarea.source-code").trigger('propertychange');
                expect(SourceCodeStyleView.prototype.trackChanges).toHaveBeenCalledTimes(2);
                fixture.find("textarea.source-code").trigger('paste');
                expect(SourceCodeStyleView.prototype.trackChanges).toHaveBeenCalledTimes(3);
                fixture.find("textarea.source-code").trigger('blur');
                expect(SourceCodeStyleView.prototype.updateModel).toHaveBeenCalledTimes(1);
            });

            it("sets 'hasChanged' flag when trackChanges() called", function () {
                expect(sourceCodeStyleView.hasChanged).toBeFalsy();
                sourceCodeStyleView.trackChanges();
                expect(sourceCodeStyleView.hasChanged).toBeTruthy();
            });

            it("throws error when invalid JSON supplied by user", function () {
                fixture.find("textarea.source-code").html("dummy text");
                fixture.find("textarea.source-code").trigger('input');
                fixture.find("textarea.source-code").trigger('blur');
                expect(window.alert).toHaveBeenCalledWith("Invalid JSON. Please revert and try again.");
            });

            it("throws error when invalid shape supplied by user", function () {
                fixture.find("textarea.source-code").html('[{"shape": "dog"}]');
                fixture.find("textarea.source-code").trigger('input');
                fixture.find("textarea.source-code").trigger('blur');
                expect(window.alert).toHaveBeenCalledWith("Invalid icon shape specified. Please revert and try again.");
            });

            it("Updates symbol correctly when valid JSON supplied", function () {
                var json = [{
                        "id": 100,
                        "title": "cat",
                        "rule": "a = 1"
                    }, {
                        "id": 101,
                        "title": "dog",
                        "rule": "b = 5"
                    }];
                //check initial settings:
                expect(Layer.prototype.set).toHaveBeenCalledTimes(0);
                expect(SourceCodeStyleView.prototype.trackChanges).toHaveBeenCalledTimes(0);
                expect(SourceCodeStyleView.prototype.updateModel).toHaveBeenCalledTimes(0);
                expect(this.layer.getSymbols().length).toEqual(3);

                //updated textarea with new valid JSON:
                fixture.find("textarea.source-code").html(JSON.stringify(json, null, 3));
                fixture.find("textarea.source-code").trigger('input');
                expect(SourceCodeStyleView.prototype.trackChanges).toHaveBeenCalledTimes(1);
                expect(sourceCodeStyleView.hasChanged).toBeTruthy();
                fixture.find("textarea.source-code").trigger('blur');

                //check that appropriate functions / triggers have been called:
                expect(SourceCodeStyleView.prototype.updateModel).toHaveBeenCalledTimes(1);
                expect(Layer.prototype.set).toHaveBeenCalledTimes(1);
                expect(Layer.prototype.trigger).toHaveBeenCalledWith("rebuild-markers");
                expect(sourceCodeStyleView.hasChanged).toBeFalsy();

                //check to see if new Symbols collection has been updated:
                expect(this.layer.get("symbols").length).toEqual(2);
                expect(this.layer.getSymbols().length).toEqual(2);
                expect(this.layer.getSymbols().at(0).get("id")).toBe(100);
                expect(this.layer.getSymbols().at(0).get("title")).toBe("cat");
                expect(this.layer.getSymbols().at(0).get("rule")).toBe("a = 1");
                expect(this.layer.getSymbols().at(1).get("id")).toBe(101);
                expect(this.layer.getSymbols().at(1).get("title")).toBe("dog");
                expect(this.layer.getSymbols().at(1).get("rule")).toBe("b = 5");
            });

        });
    });
