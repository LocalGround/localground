define(["jquery",
        "backbone",
        "views/tables/tableHeader",
        "collections/forms",
        "../../../test/spec-helper"],
    function ($, Backbone, TableHeader, Forms) {
        'use strict';
        var tableHeader,
            AppRouter = Backbone.Router.extend({
                routes: { ":id": "get-table-data" }
            }),
            app = {
                activeTableID: 2,
                projectID: 2,
                router: new AppRouter()
            },
            vent = _.extend({}, Backbone.Events);
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
                    tableHeader = new TableHeader({ globalEvents: vent, app: app });
                }).not.toThrow();

                expect(function () {
                    tableHeader = new TableHeader({ app: app });
                }).toThrow();

                expect(function () {
                    tableHeader = new TableHeader({ globalEvents: vent });
                }).toThrow();

                expect(function () {
                    tableHeader = new TableHeader();
                }).toThrow();
            });

            it("renders top bar", function () {
                tableHeader = new TableHeader({ globalEvents: vent, app: app });
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
                tableHeader = new TableHeader({ globalEvents: vent, app: app });
                expect(TableHeader.prototype.render).toHaveBeenCalled();
                expect(TableHeader.prototype.loadFormSelector).toHaveBeenCalled();
                expect(Forms.prototype.initialize).toHaveBeenCalled();
            });

            it("listens to triggerInsertRowTop event handler", function () {
                spyOn(TableHeader.prototype, "triggerInsertRowTop").and.callThrough();
                spyOn(vent, "trigger");
                tableHeader = new TableHeader({ globalEvents: vent, app: app });
                tableHeader.$el.find('#add_row_top').trigger('click');
                expect(TableHeader.prototype.triggerInsertRowTop).toHaveBeenCalled();
                expect(vent.trigger).toHaveBeenCalledWith("insertRowTop", jasmine.any(Object));
            });

            it("listens to triggerInsertRowBottom event handler", function () {
                spyOn(TableHeader.prototype, "triggerInsertRowBottom").and.callThrough();
                spyOn(vent, "trigger");

                tableHeader = new TableHeader({ globalEvents: vent, app: app });

                tableHeader.$el.find('#add_row_bottom').trigger('click');
                expect(TableHeader.prototype.triggerInsertRowBottom).toHaveBeenCalled();
                expect(vent.trigger).toHaveBeenCalledWith("insertRowBottom", jasmine.any(Object));
            });
            it("listens to triggerQuery event handler", function () {
                spyOn(TableHeader.prototype, "triggerQuery").and.callThrough();
                spyOn(vent, "trigger");

                tableHeader = new TableHeader({ globalEvents: vent, app: app });

                tableHeader.$el.find('.query').trigger('click');
                expect(TableHeader.prototype.triggerQuery).toHaveBeenCalled();
                expect(vent.trigger).toHaveBeenCalledWith("requery", jasmine.any(String));
            });

            it("listens to triggerClearQuery event handler", function () {
                spyOn(TableHeader.prototype, "triggerClearQuery").and.callThrough();
                spyOn(TableHeader.prototype, "triggerQuery").and.callThrough();
                spyOn(vent, "trigger");

                tableHeader = new TableHeader({ globalEvents: vent, app: app });

                tableHeader.$el.find('.clear').trigger('click');
                expect(TableHeader.prototype.triggerClearQuery).toHaveBeenCalled();
                expect(TableHeader.prototype.triggerQuery).toHaveBeenCalled();
            });

            it("listens to triggerInsertRowTop event handler", function () {
                spyOn(TableHeader.prototype, "triggerInsertColumn").and.callThrough();
                spyOn(vent, "trigger");

                tableHeader = new TableHeader({ globalEvents: vent, app: app });

                tableHeader.$el.find('#add_column').trigger('click');
                expect(TableHeader.prototype.triggerInsertColumn).toHaveBeenCalled();
                expect(vent.trigger).toHaveBeenCalledWith("insertColumn", jasmine.any(Object));
            });
        });

        describe("TableHeader: Methods work", function () {
            beforeEach(function () {
                var $navbar = $('<div id="navbar"></div>');
                $(document.body).append($navbar);
            });
            afterEach(function () {
                $("#navbar").remove();
            });
            it("initializes with parameters", function () {
                spyOn(app.router, "navigate");
                tableHeader = new TableHeader({ globalEvents: vent, app: app });
                tableHeader.navigateToTable();
                expect(app.router.navigate).toHaveBeenCalledWith("/" + tableHeader.collection.models[0].id, true);
            });
        });
    });