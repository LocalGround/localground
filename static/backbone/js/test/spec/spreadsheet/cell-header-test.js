define(["backbone",
        "lib/tables/cells/header-cell",
        "lib/tables/cells/header-cell-blank",
        "../../../test/spec-helper"],
    function (Backbone, HeaderCell, HeaderCellBlank) {
        'use strict';
        var HeaderCellClass,
            column,
            headerCell,
            i,
            token;
        describe("CellHeader: Test initialization", function () {
            beforeEach(function () {
                HeaderCellClass = HeaderCell.extend({ collection: this.columns });
                this.columns.trigger('reset');
                column = this.columns.at(4);
            });
            it("Loads correctly if initialization params have been properly set.", function () {
                expect(function () {
                    headerCell = new HeaderCellClass({
                        column: column
                    });
                }).not.toThrow();
            });
        });

        describe("CellHeader: Test renderer", function () {
            beforeEach(function () {
                HeaderCellClass = HeaderCell.extend({ collection: this.columns });
                this.columns.trigger('reset');
                spyOn(HeaderCellClass.prototype, 'onClick');
                spyOn(HeaderCellClass.prototype, 'deleteColumn');
                headerCell = new HeaderCellClass({
                    column: this.columns.at(4)
                });
            });

            it("Instantiates the correct headerColumn type based on whether it's administrative or not", function () {
                for (i = 0; i < this.columns.length; i++) {
                    column = this.columns.at(i);
                    token = '<i class="fa fa-trash-o" style="cursor:pointer;"></i>';
                    if (column.get("isAdmin")) {
                        HeaderCellClass = HeaderCellBlank.extend({ collection: this.columns });
                        headerCell = new HeaderCellClass({ column: column });
                        headerCell.render();
                        expect(column.get("headerCell") == HeaderCellBlank).toBeTruthy();
                        expect(headerCell.$el.html()).not.toContain(token);
                    } else {
                        HeaderCellClass = HeaderCell.extend({ collection: this.columns });
                        headerCell = new HeaderCellClass({ column: column });
                        headerCell.render();
                        expect(column.get("headerCell") == HeaderCell).toBeTruthy();
                        expect(headerCell.$el.html()).toContain(token);
                    }
                }
            });

            it("Renders constituent buttons / text", function () {
                headerCell.render();
                _.each([
                    '<a class="sorter">tags<b class="sort-caret"></b></a>',
                    this.columns.at(4).get("col_name"),
                    '<i class="fa fa-trash-o" style="cursor:pointer;"></i>'],
                    function (token) {
                        expect(headerCell.$el.html()).toContain(token);
                    });
            });

            it("Listens for event handlers", function () {
                headerCell.render();
                expect(HeaderCellClass.prototype.onClick).not.toHaveBeenCalled();
                expect(HeaderCellClass.prototype.deleteColumn).not.toHaveBeenCalled();
                headerCell.$el.find('a.sorter').trigger('click');
                headerCell.$el.find('i.fa-trash-o').trigger('click');
                expect(HeaderCellClass.prototype.onClick).toHaveBeenCalled();
                expect(HeaderCellClass.prototype.deleteColumn).toHaveBeenCalled();
            });
        });

        describe("CellHeader: Test methods", function () {
            beforeEach(function () {
                HeaderCellClass = HeaderCell.extend({ collection: this.columns });
                this.columns.trigger('reset');
                headerCell = new HeaderCellClass({
                    column: this.columns.at(4)
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