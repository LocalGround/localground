define([
    "jquery",
    "backbone",
    "backgrid",
    "views/tables/tableHeader",
    "views/tables/datagrid",
    "collections/columns",
    "views/tables/column-manager",
    "collections/records",
    "collections/forms",
    "colResizable",
    "backgrid-paginator",
    "bootstrap-form-templates",
    "backbone-bootstrap-modal"
], function ($, Backbone, Backgrid, TableHeader, DataGrid, Columns, ColumnManager, Records, Forms) {
	"use strict";
    var TableEditor = Backbone.View.extend({
		el: "body",
		tableHeader: null,
		paginator: null,
		url: null,
		query: null,
		columns: null,
		records: null,
		datagrid: null,
        columnManager: null,
        modal: null,
        app: null,
		globalEvents: _.extend({}, Backbone.Events),
		initialize: function (opts) {
            opts = opts || {};
            $.extend(this, opts);
            var that = this,
                AppRouter;

            //shared functionality to be passed across objects:
            this.app = {
                router: null,
                activeTableID: null,
                projectID: opts.projectID
            };
            this.forms = new Forms();
            this.tableHeader = new TableHeader({
                collection: this.forms,
                globalEvents: this.globalEvents,
                app: this.app
            });

            AppRouter = Backbone.Router.extend({
                routes: {
                    ":id": "get-table-data"
                }
            });

            this.router = this.app.router = new AppRouter();
            this.router.on('route:get-table-data', this.createTableSchema, this);
            try { Backbone.history.start(); } catch (ex) {}
            this.attachEventHandlers();
        },
        attachEventHandlers: function () {
            var that = this;
            this.globalEvents.on("requery", function (sql) {
                that.query = sql;
                //that.getRecords({query: sql});
                that.getRecords();
            });

            this.globalEvents.on("insertColumn", function (scope) {
                if (scope && scope instanceof TableEditor) { that = scope; }
                that.columnManager.render();
            });
        },
        createTableSchema: function (id) {
            this.app.activeTableID = id;
            this.url = '/api/0/forms/' + id + '/data/';
            this.columns = new Columns(null, {
                url: this.url.replace('data/', 'fields/'),
                globalEvents: this.globalEvents
            });
            this.columns.fetch({reset: true, data: { page_size: 100 }});
            this.columns.on('render-grid', this.render, this);
            this.columnManager = new ColumnManager({
                url: this.url,
                globalEvents: this.globalEvents,
                columns: this.columns
            });
        },
        render: function () {
            console.log('rendering table editor');
            var that = this;
            this.records = new Records([], {
                url: this.url
            });
            this.grid = new DataGrid({
                columns: this.columns,
                records: this.records,
                globalEvents: this.globalEvents,
                app: this.app
            });
            $(window).off('resize');
            $(window).on('resize', function () {
                that.grid.resize();
            });

            this.paginator = new Backgrid.Extension.Paginator({
                collection: this.records,
                goBackFirstOnSort: false
            });
            this.getRecords();
            this.$el.find('.container-footer').html(this.paginator.render().el);
        },
        getRecords: function () {
            this.records.query = this.query;
            //	Make sure when a query is issued,
            //	the current page is reset to the first page:
            this.records.state.currentPage = 1;
            this.records.fetch({
                reset: true,
                data: { format: 'json' }
            });
        }
    });
    return TableEditor;
});
