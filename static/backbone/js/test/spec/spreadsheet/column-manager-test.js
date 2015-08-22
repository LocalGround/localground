define(["backbone",
        "models/field",
        "collections/columns",
        "views/tables/column-manager",
        "../../../test/spec-helper"],
    function (Backbone, Field, Columns, ColumnManager) {
        'use strict';
        var globalEvents = Backbone.Events,
            cm,
            url = '/api/0/forms/2/fields/',
            columns = new Columns(null, {
                url: '/api/0/forms/2/fields/'
            });
        describe("ColumnManager: Test initialization", function () {
            beforeEach(function () {
                spyOn(ColumnManager.prototype.dataTypes, 'fetch');
                spyOn(ColumnManager.prototype, 'render');
            });

            it("Loads correctly if initialization params have been properly set.", function () {
                expect(function () {
                    cm = new ColumnManager({
                        url: url,
                        columns: columns,
                        globalEvents: globalEvents
                    });
                }).not.toThrow();

                expect(function () {
                    cm = new ColumnManager({ url: url });
                }).toThrow();

                expect(function () {
                    cm = new ColumnManager({ columns: columns });
                }).toThrow();

                expect(function () {
                    cm = new ColumnManager();
                }).toThrow();
            });

            it("Sets parameters & triggers events correctly on initialization", function () {
                var cm = new ColumnManager({
                    url: url,
                    columns: columns,
                    globalEvents: globalEvents
                });
                expect(cm.model instanceof Field).toBeTruthy();
                expect(ColumnManager.prototype.dataTypes.fetch).toHaveBeenCalled();
                cm.model.trigger('schema-ready');
                expect(ColumnManager.prototype.render).toHaveBeenCalled();
            });
        });

        describe("ColumnManager: Test renderer", function () {
            //add spies to prototype before you create the instance:
            var cm;
            beforeEach(function () {
                spyOn(ColumnManager.prototype.dataTypes, 'fetch');
                cm = new ColumnManager({
                    url: url,
                    columns: columns,
                    globalEvents: globalEvents
                });
                columns.fetch();
            });

            it("renders the form modal correctly", function () {
                cm.render();
                expect(cm.modal instanceof Backbone.BootstrapModal).toBeTruthy();
                expect(cm.modal.$el.find('.form-group').length).toBe(3);
                expect(cm.modal.$el.html()).toContain('btn cancel');
                expect(cm.modal.$el.html()).toContain('btn ok');
            });

            it("sets the \"ordering\" parameter correctly", function () {
                expect(cm.model instanceof Field).toBeTruthy();
                expect(cm.model.get("ordering")).toBe(4);
            });

        });

        describe("ColumnManager: Test modal", function () {
            //add spies to prototype before you create the instance:
            var cm;
            beforeEach(function () {
                cm = new ColumnManager({
                    url: url,
                    columns: columns,
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
