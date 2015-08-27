define(["jquery",
        "backbone",
        "views/tables/table-layout-manager",
        "views/tables/datagrid",
        "collections/columns",
        "collections/records",
        "views/tables/column-manager",
        "../../../test/spec-helper"],
    function ($, Backbone, TableLayoutManager, DataGrid, Columns, Records, ColumnManager) {
        'use strict';
        var layoutManager, datagrid;
        describe("TableLayoutManager: Test initialization", function () {
            beforeEach(function () {
                spyOn(Columns.prototype, 'fetch');
                spyOn(Records.prototype, 'fetch');
                spyOn(ColumnManager.prototype.dataTypes, 'fetch');
                spyOn(ColumnManager.prototype, 'render');
                spyOn(TableLayoutManager.prototype, 'initLayout');
                datagrid = new DataGrid({
                    globalEvents: _.extend({}, Backbone.Events),
                    app: { activeTableID: 2, projectID: 2 }
                });
            });
            it("Loads correctly if initialization params have been properly set.", function () {
                expect(function () {
                    layoutManager = new TableLayoutManager({ datagrid: datagrid });
                }).not.toThrow();
                expect(function () {
                    layoutManager = new TableLayoutManager();
                }).toThrow();
            });
            it("Listens for records's backgrid:refresh event", function () {
                layoutManager = new TableLayoutManager({ datagrid: datagrid });
                datagrid.records.trigger("backgrid:refresh");
                expect(TableLayoutManager.prototype.initLayout).toHaveBeenCalled();
            });
            it("Listens for column's column-added event", function () {
                layoutManager = new TableLayoutManager({ datagrid: datagrid });
                datagrid.columns.trigger("column-added");
                expect(TableLayoutManager.prototype.initLayout).toHaveBeenCalled();
            });
            it("Listens for column's schema-updated event", function () {
                layoutManager = new TableLayoutManager({ datagrid: datagrid });
                datagrid.columns.trigger("schema-updated");
                expect(TableLayoutManager.prototype.initLayout).toHaveBeenCalled();
            });
            it("Listens for columns's change:display_width event", function () {
                layoutManager = new TableLayoutManager({ datagrid: datagrid });
                datagrid.columns.trigger("change:display_width");
                expect(TableLayoutManager.prototype.initLayout).toHaveBeenCalled();
            });
        });

        describe("TableLayoutManager: Test methods", function () {
            beforeEach(function () {
                //spyOn(Columns.prototype, 'fetch');
                //spyOn(Records.prototype, 'fetch');
                spyOn(ColumnManager.prototype.dataTypes, 'fetch');
                spyOn(ColumnManager.prototype, 'render');
                datagrid = new DataGrid({
                    globalEvents: _.extend({}, Backbone.Events),
                    app: { activeTableID: 2, projectID: 2 }
                });
                datagrid.render();
                //datagrid.getColumns();
            });

            it("Method call initLayout() calls resize() and makeColumnsResizable()", function () {
                spyOn(TableLayoutManager.prototype, 'resize');
                spyOn(TableLayoutManager.prototype, 'makeColumnsResizable');
                layoutManager = new TableLayoutManager({ datagrid: datagrid });
                layoutManager.initLayout();
                expect(TableLayoutManager.prototype.resize).toHaveBeenCalled();
                expect(TableLayoutManager.prototype.makeColumnsResizable).toHaveBeenCalled();
            });

            it("Method call makeColumnsResizable() adds the col-resizer functionality to the DOM", function () {
                layoutManager = new TableLayoutManager({ datagrid: datagrid });
                layoutManager.initLayout();
                expect(datagrid.$el.find(".JCLRgrips").children().length).toBe(datagrid.columns.length);
            });

            it("Column drag triggers an update database call", function () {
                spyOn(TableLayoutManager.prototype, 'saveResizeToDatabase');
                layoutManager = new TableLayoutManager({ datagrid: datagrid });
                layoutManager.initLayout();
                var $dragger = $(datagrid.$el.find(".JCLRgrips").children()[4]);
                $dragger.trigger('mousedown');
                $(document).trigger('mousemove.JColResizer');
                $(document).trigger('mouseup.JColResizer', { testing: true });
                expect(TableLayoutManager.prototype.saveResizeToDatabase).toHaveBeenCalled();
            });
        });
    });