var rootDir = "../../";
define([
    "backbone",
    rootDir + "apps/style/views/right/data-source-view"
],
    function (Backbone, DataSourceView) {
        'use strict';
        var dataSourceView,
            fixture,
            initView = function (scope) {
                // 1) add spies for all relevant objects:
                spyOn(DataSourceView.prototype, 'initialize').and.callThrough();
                fixture = setFixtures('<div></div>');

                // 2) initialize rightPanel object:
                dataSourceView = new DataSourceView({
                    app: scope.app,
                    //need to revisit this and make sure it's doing what we want
                    model: scope.layer
                });
                dataSourceView.render();

                // 3) set fixture:
                fixture.append(dataSourceView.$el);
            };

        describe("When DataSourceView is initialized", function () {
            beforeEach(function () {
                initView(this);
            });

            afterEach(function () {
                Backbone.history.stop();
            });

            it("should initialize", function () {
                expect(dataSourceView).toEqual(jasmine.any(DataSourceView));
                expect(dataSourceView.initialize).toHaveBeenCalledTimes(1);
            });

            it("should have correct html", function () {
                expect(fixture).toContainElement('.layer-title');
            });

            it("sets model correctly", function () {
                expect(dataSourceView.model).toEqual(this.layer);
            });
        });
    });
