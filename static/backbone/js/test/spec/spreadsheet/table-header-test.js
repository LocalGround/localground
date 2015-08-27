define(["jquery",
        "backbone",
        "views/tables/tableHeader",
        "collections/forms",
        "../../../test/spec-helper"],
    function ($, Backbone, TableHeader, Forms) {
        'use strict';
        var tableHeader;
        describe("TableHeader: Test initialization", function () {
            beforeEach(function () {
                var $navbar = $('<div id="navbar"></div>');
                $(document.body).append($navbar);
            });
            afterEach(function () {
                $("#navbar").remove();
            });
            it("initializes with parameters", function () {
                expect(function () {
                    tableHeader = new TableHeader({
                        globalEvents: _.extend({}, Backbone.Events),
                        app: { activeTableID: 2, projectID: 2 }
                    });
                }).not.toThrow();

                expect(function () {
                    tableHeader = new TableHeader({
                        app: { activeTableID: 2, projectID: 2 }
                    });
                }).toThrow();

                expect(function () {
                    tableHeader = new TableHeader({
                        globalEvents: _.extend({}, Backbone.Events)
                    });
                }).toThrow();

                expect(function () {
                    tableHeader = new TableHeader();
                }).toThrow();
            });

            it("renders top bar", function () {
                tableHeader = new TableHeader({
                    globalEvents: _.extend({}, Backbone.Events),
                    app: { activeTableID: 2, projectID: 2 }
                });
                var html = tableHeader.$el.html();
                _.each([
                    '<form class="navbar-form navbar-left" role="search">',
                    '<ul id="tableSelect" class="dropdown-menu" role="menu"></ul>',
                    '<li><a href="#">Local Ground</a></li>',
                    '<ul class="dropdown-menu" role="menu">'
                ], function (snippet) {
                    expect(html).toContain(snippet);
                });
            });

            it("makes initial function calls", function () {
                spyOn(TableHeader.prototype, "render");
                spyOn(TableHeader.prototype, "loadFormSelector");
                spyOn(Forms.prototype, "initialize");
                tableHeader = new TableHeader({
                    globalEvents: _.extend({}, Backbone.Events),
                    app: { activeTableID: 2, projectID: 2 }
                });
                expect(TableHeader.prototype.render).toHaveBeenCalled();
                expect(TableHeader.prototype.loadFormSelector).toHaveBeenCalled();
                expect(Forms.prototype.initialize).toHaveBeenCalled();
            });

            it("listens to event handlers", function () {
                spyOn(TableHeader.prototype, "triggerInsertRowTop");
                spyOn(TableHeader.prototype, "triggerInsertRowBottom");
                spyOn(TableHeader.prototype, "triggerQuery");
                spyOn(TableHeader.prototype, "triggerClearQuery");
                spyOn(TableHeader.prototype, "triggerInsertColumn");
                tableHeader = new TableHeader({
                    globalEvents: _.extend({}, Backbone.Events),
                    app: { activeTableID: 2, projectID: 2 }
                });
                tableHeader.$el.find('#add_row_top').trigger('click');
                expect(TableHeader.prototype.triggerInsertRowTop).toHaveBeenCalled();

                tableHeader.$el.find('#add_row_bottom').trigger('click');
                expect(TableHeader.prototype.triggerInsertRowBottom).toHaveBeenCalled();

                tableHeader.$el.find('.query').trigger('click');
                expect(TableHeader.prototype.triggerQuery).toHaveBeenCalled();

                tableHeader.$el.find('.clear').trigger('click');
                expect(TableHeader.prototype.triggerClearQuery).toHaveBeenCalled();

                tableHeader.$el.find('#add_column').trigger('click');
                expect(TableHeader.prototype.triggerInsertColumn).toHaveBeenCalled();
            });
        });
    });