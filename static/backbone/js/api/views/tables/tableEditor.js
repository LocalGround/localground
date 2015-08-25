define([
    "underscore",
    "backbone",
    "backgrid",
    "views/tables/tableHeader",
    "views/tables/datagrid",
    "backgrid-paginator"
], function (_, Backbone, Backgrid, TableHeader, DataGrid) {
	"use strict";
    var TableEditor = Backbone.View.extend({
		el: "body",
		tableHeader: null,
		paginator: null,
		url: null,
		datagrid: null,
        app: null,
		globalEvents: _.extend({}, Backbone.Events),
		initialize: function (opts) {
            _.extend(this, opts);
            if (!this.projectID) {
                throw new Error("TableEditor Error: opts.projectID must be defined");
            }

            //shared functionality to be passed across objects:
            this.app = {
                router: null,
                activeTableID: null,
                projectID: this.projectID
            };
            this.tableHeader = new TableHeader({
                globalEvents: this.globalEvents,
                app: this.app
            });
            this.configureRouter();
        },
        configureRouter: function () {
            var AppRouter = Backbone.Router.extend({
                routes: {
                    ":id": "get-table-data"
                }
            });
            this.router = this.app.router = new AppRouter();
            this.router.on('route:get-table-data', this.loadGrid, this);
            try { Backbone.history.start(); } catch (ex) {}
        },
        loadGrid: function (id) {
            this.app.activeTableID = id;
            this.grid = new DataGrid({
                globalEvents: this.globalEvents,
                app: this.app
            });

            //question: should paginator be part of the datagrid?
            this.paginator = new Backgrid.Extension.Paginator({
                collection: this.grid.records,
                goBackFirstOnSort: false
            });
            this.$el.find('.container-footer').html(this.paginator.render().el);
        }
    });
    return TableEditor;
});
