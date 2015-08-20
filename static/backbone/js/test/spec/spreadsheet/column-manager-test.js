define(["backbone",
        "models/field",
        "views/tables/column-manager",
        "../../../test/spec-helper"],
    function (Backbone, Field, ColumnManager) {
        'use strict';
        var globalEvents = Backbone.Events;
        describe("ColumnManager:", function () {
            it("Loads correctly if initialization params have been properly set.", function () {
                var cm;
                expect(function () {
                    cm = new ColumnManager({
                        url: '/api/0/forms/2/fields',
                        ordering: 5,
                        globalEvents: globalEvents
                    });
                }).not.toThrow();

                expect(function () {
                    cm = new ColumnManager({ url: '/api/0/forms/2/fields' });
                }).toThrow();

                expect(function () {
                    cm = new ColumnManager({ ordering: 1 });
                }).toThrow();

                expect(function () {
                    cm = new ColumnManager();
                }).toThrow();
            });

            it("Initializes parameters correctly", function () {
                //add spy to prototype before you create the instance:
                spyOn(ColumnManager.prototype, 'addColumnToGrid');
                var cm = new ColumnManager({
                    url: '/api/0/forms/2/fields',
                    ordering: 5,
                    globalEvents: globalEvents
                });
                expect(cm.model instanceof Field).toBeTruthy();
                cm.model.trigger('sync');
                expect(cm.addColumnToGrid).toHaveBeenCalled();
            });

            it("Renders the \"add field\" form", function () {
                //add spy to prototype before you create the instance:
                spyOn(ColumnManager.prototype, 'render');
                var cm = new ColumnManager({
                    url: '/api/0/forms/2/fields',
                    ordering: 5,
                    globalEvents: globalEvents
                });
                cm.model.trigger('schema-ready');
                expect(ColumnManager.prototype.render).toHaveBeenCalled();
            });

        });
    });
