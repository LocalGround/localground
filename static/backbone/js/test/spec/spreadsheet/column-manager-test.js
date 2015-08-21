define(["backbone",
        "models/field",
        "collections/columns",
        "views/tables/column-manager",
        "../../../test/spec-helper"],
    function (Backbone, Field, Columns, ColumnManager) {
        'use strict';
        var globalEvents = Backbone.Events;
        describe("ColumnManager: Test initialization", function () {
            var cm,
                url = '/api/0/forms/2/fields/',
                columns = new Columns(null, {
                    url: url,
                    globalEvents: globalEvents
                });
            cm = new ColumnManager({
                url: url,
                columns: columns,
                globalEvents: globalEvents
            });
            //afterEach(function () {
            //    cm.$el.empty();
            //});
            it("Loads correctly if initialization params have been properly set.", function () {
                expect(columns instanceof Columns).toBeTruthy();
                expect(cm.columns instanceof Columns).toBeTruthy();
                expect(function () {
                    cm = new ColumnManager({
                        url: url,
                        columns: columns,
                        globalEvents: globalEvents
                    });
                }).not.toThrow();

                /*expect(function () {
                    cm = new ColumnManager({ url: '/api/0/forms/2/fields' });
                }).toThrow();

                expect(function () {
                    cm = new ColumnManager({ ordering: 1 });
                }).toThrow();

                expect(function () {
                    cm = new ColumnManager();
                }).toThrow();*/
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
                expect(ColumnManager.prototype.addColumnToGrid).toHaveBeenCalled();
            });
        });

        describe("ColumnManager: Test events", function () {
            //add spies to prototype before you create the instance:
            var cm;
            beforeEach(function () {
                spyOn(ColumnManager.prototype, 'render');
                spyOn(ColumnManager.prototype, 'addColumnToGrid');
                cm = new ColumnManager({
                    url: '/api/0/forms/2/fields',
                    ordering: 5,
                    globalEvents: globalEvents
                });
            });
            afterEach(function () {
                cm.$el.empty();
            });

            it("Renders the \"add field\" form when field's schema is ready", function () {
                cm.model.trigger('schema-ready');
                expect(ColumnManager.prototype.render).toHaveBeenCalled();
            });

            it("Calls \"addColumnToGrid\" when the popup form is saved.", function () {
                expect(cm.model instanceof Field).toBeTruthy();
                expect(cm.model.get("ordering")).toBe(5);
                cm.model.trigger('sync');
                expect(ColumnManager.prototype.addColumnToGrid).toHaveBeenCalled();
            });

        });

        describe("ColumnManager: Test modal", function () {
            //add spies to prototype before you create the instance:
            var cm;
            beforeEach(function () {
                cm = new ColumnManager({
                    url: '/api/0/forms/2/fields',
                    ordering: 5,
                    globalEvents: globalEvents
                });
            });
            afterEach(function () {
                cm.$el.empty();
            });

            it("Ensure modal has been rendered & that modal events work", function () {
                cm.render();
                expect(cm.addColumnForm).not.toBeNull();
                expect(cm.modal).not.toBeNull();
                spyOn(cm.addColumnForm, 'commit');
                spyOn(cm.model, 'save');
                cm.modal.trigger('ok');
                expect(cm.addColumnForm.commit).toHaveBeenCalled();
                expect(cm.model.save).toHaveBeenCalled();
            });
        });
    });
