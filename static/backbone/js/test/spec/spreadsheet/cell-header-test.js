define(["backbone",
        "lib/tables/cells/header-cell",
        "../../../test/spec-helper"],
    function (Backbone, HeaderCell) {
        'use strict';
        var HeaderCellTest,
            column,
            headerCell;
        describe("ColumnManager: Test initialization", function () {
            beforeEach(function () {
                HeaderCellTest = HeaderCell.extend({ collection: this.columns });
                column = this.columns.at(0);
            });
            it("Loads correctly if initialization params have been properly set.", function () {
                expect(function () {
                    headerCell = new HeaderCellTest({
                        column: column
                    });
                }).not.toThrow();
            });
        });

        describe("ColumnManager: Test renderer", function () {
            beforeEach(function () {
                HeaderCellTest = HeaderCell.extend({ collection: this.columns });
                spyOn(HeaderCellTest.prototype, 'onClick');
                spyOn(HeaderCellTest.prototype, 'deleteColumn');
                headerCell = new HeaderCellTest({
                    column: this.columns.at(0)
                });
            });

            it("Renders constituent buttons / text", function () {
                headerCell.render();
                _.each([
                    '<a class="sorter">tags<b class="sort-caret"></b></a>',
                    this.columns.at(0).get("col_name"),
                    '<i class="fa fa-trash-o" style="cursor:pointer;"></i>'],
                    function (token) {
                        expect(headerCell.$el.html()).toContain(token);
                    });
            });

            it("Listens for event handlers", function () {
                headerCell.render();
                expect(HeaderCellTest.prototype.onClick).not.toHaveBeenCalled();
                expect(HeaderCellTest.prototype.deleteColumn).not.toHaveBeenCalled();
                headerCell.$el.find('a.sorter').trigger('click');
                headerCell.$el.find('i.fa-trash-o').trigger('click');
                expect(HeaderCellTest.prototype.onClick).toHaveBeenCalled();
                expect(HeaderCellTest.prototype.deleteColumn).toHaveBeenCalled();
            });
        });

        describe("ColumnManager: Test methods", function () {
            beforeEach(function () {
                HeaderCellTest = HeaderCell.extend({ collection: this.columns });
                headerCell = new HeaderCellTest({
                    column: this.columns.at(0)
                });
            });

            it("Displays a confirm when user asks to delete", function () {
                spyOn(window, 'confirm');
                expect(window.confirm).not.toHaveBeenCalled();
                headerCell.deleteColumn();
                expect(window.confirm).toHaveBeenCalled();
            });

            it("Deletes the column when deleteColumnConfirmed is called", function () {
                var deleted = false,
                    numColumns = headerCell.collection.length;
                spyOn(Backbone, 'sync').and.callFake(function (method, model, success, error) {
                    if (method == "delete") {
                        deleted = true;
                        success.success();
                    }
                });
                expect(deleted).toBeFalsy();
                headerCell.deleteColumnConfirmed();
                expect(deleted).toBeTruthy();
                expect(numColumns - 1).toBe(headerCell.collection.length);
            });
        });
    });