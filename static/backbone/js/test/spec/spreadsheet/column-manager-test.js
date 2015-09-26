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
                cm = new ColumnManager({
                    url: url,
                    columns: columns,
                    globalEvents: globalEvents
                });
                expect(ColumnManager.prototype.dataTypes.fetch).toHaveBeenCalled();
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

            it("Renders the form modal correctly", function () {
                cm.render();
                expect(cm.model instanceof Field).toBeTruthy();
                expect(cm.modal instanceof Backbone.BootstrapModal).toBeTruthy();
                expect(cm.modal.$el.find('.form-group').length).toBe(3);
                expect(cm.modal.$el.html()).toContain('btn cancel');
                expect(cm.modal.$el.html()).toContain('btn ok');
            });

            it("Ensure modal has been rendered & that modal events work", function () {
                spyOn(ColumnManager.prototype, 'addColumn');
                expect(ColumnManager.prototype.addColumn).not.toHaveBeenCalled();
                cm.render();
                expect(cm.model.get("ordering")).toBe(5);

                spyOn(cm.model, 'save');
                expect(cm.model.save).not.toHaveBeenCalled();

                cm.modal.trigger('ok');
                expect(cm.model.save).toHaveBeenCalled();

                cm.model.trigger('model-columnized');
                expect(cm.addColumn).toHaveBeenCalled();
            });

            it("Ensure that addColumn method works", function () {
                var numColumns = cm.columns.length;
                cm.render();
                cm.addColumn();
                expect(numColumns + 1).toBe(cm.columns.length);
            });
        });

    });
