define([
    "backbone",
    "backgrid",
    "collections/columns",
    "collections/records",
    "views/tables/column-manager",
    "views/tables/table-layout-manager",
    "lib/tables/gridBody",
    "lib/tables/gridRow",
    "views/tables/table-utilities-mixin"
], function (Backbone, Backgrid, Columns, Records, ColumnManager,
        TableLayoutManager, GridBody, GridRow, Utilities) {
	/**
     * Class that initializes a DataGrid tileset.
     * @class DataGrid
     */
    "use strict";
    var DataGrid = Backbone.View.extend({
        el: "#grid",
        formID: null,
        records: null,
        columns: null,
        layoutManager: null,
        globalEvents: null,
        blankRow: null,
        grid: null,
        initialize: function (opts) {
            _.extend(this, opts);
            this.ensureRequiredParam("globalEvents");
            this.ensureRequiredParam("app");

            var columnsURL = '/api/0/forms/' + this.app.activeTableID + '/fields/',
                recordsURL = '/api/0/forms/' + this.app.activeTableID + '/data/';
            this.blankRow = { project_id: this.app.projectID };
            this.columns = new Columns(null, { url: columnsURL });
            this.records = new Records(null, { url: recordsURL, mode: "client" });
            this.columnManager = new ColumnManager({
                url: columnsURL,
                globalEvents: this.globalEvents,
                columns: this.columns,
                grid: this
            });
            this.grid = new Backgrid.Grid({
                body: GridBody,
                columns: this.columns,
                collection: this.records,
                row: GridRow
            });
            this.$el.html(this.grid.render().el);
            this.layoutManager = new TableLayoutManager({ datagrid: this });
            this.initEventListeners();
            this.getColumns();
        },
        initEventListeners: function () {
            var that = this;
            this.listenTo(this.columns, 'reset', this.initGrid);
            this.listenTo(this.records, 'init-grid', this.render);
            this.listenTo(this.records, 'backgrid:next', function (i, j, outOfBound) {
                console.log(i, j, outOfBound);
                if (outOfBound) {
                    that.grid.insertRow(this.blankRow, { at: (i + 1) });
                }
            });
            this.globalEvents.on("insertRowTop", this.insertRowTop, this);
            this.globalEvents.on("insertRowBottom", this.insertRowBottom, this);
            this.globalEvents.on("insertColumn", this.columnManager.render, this);
            this.globalEvents.on("requery", function (sql) {
                that.query = sql;
                //that.getRecords({query: sql});
                that.getRecords();
            });
        },

        getColumns: function () {
            this.columns.fetch({reset: true, data: { page_size: 100 }});
        },

        getRecords: function () {
            this.records.query = this.query;
            //	Make sure when a query is issued,
            //	the current page is reset to the first page:
            this.records.state.currentPage = 1;
            this.records.fetch({ reset: true, data: { format: 'json' } });
            this.records.trigger('init-grid');
        },

        initGrid: function () {
            this.getRecords();
            //this.render();
        },

        render: function () {
            this.grid.render();
            //this.layoutManager.initLayout();
        },

        insertRowTop: function (e) {
            //	this.records.add({ project_id: 2 }, { at: 0 });
            //	todo: ensure that record auto-populates w/default project selected.
            //  ACTUALLY: we should require that users can only edit when an
            //	active project is selected.
            this.grid.insertRow(this.blankRow, { at: 0 });
            this.layoutManager.initLayout();
            if (e) { e.preventDefault(); }
        },

        insertRowBottom: function (e) {
            this.grid.insertRow(this.blankRow, { at: this.records.length});
            this.layoutManager.initLayout();
            if (e) { e.preventDefault(); }
        }
    });
    _.extend(DataGrid.prototype, Utilities);
    return DataGrid;
});
