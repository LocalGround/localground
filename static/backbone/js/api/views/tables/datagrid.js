define(["backbone",
        "backgrid",
        "collections/columns",
        "collections/records",
        "views/tables/column-manager",
        "views/tables/table-layout-manager"
    ], function (Backbone, Backgrid, Columns, Records, ColumnManager, TableLayoutManager) {
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
            this.globalEvents = opts.globalEvents;
            this.app = opts.app;
            this.columnsURL = '/api/0/forms/' + this.app.activeTableID + '/fields/';
            this.recordsURL = '/api/0/forms/' + this.app.activeTableID + '/data/';
            this.blankRow = { project_id: this.app.projectID };
            this.columns = new Columns(null, { url: this.columnsURL });
            this.columnManager = new ColumnManager({
                url: this.columnsURL,
                globalEvents: this.globalEvents,
                columns: this.columns
            });
            this.records = new Records([], { url: this.recordsURL });
            this.grid = new Backgrid.Grid({
                body: this.getGridBody(),
                columns: this.columns,
                collection: this.records,
                row: this.getGridRow()
            });
            this.layoutManager = new TableLayoutManager({ datagrid: this });
            this.initEventListeners();
            this.getColumns();
        },

        initEventListeners: function () {
            var that = this;
            this.globalEvents.on("insertRowTop", function (e) {
                that.insertRowTop(e);
            });

            this.globalEvents.on("insertRowBottom", function (e) {
                that.insertRowBottom(e);
            });

            this.globalEvents.on("requery", function (sql) {
                that.query = sql;
                //that.getRecords({query: sql});
                that.getRecords();
            });

            this.globalEvents.on("insertColumn", function () {
                that.columnManager.render();
            });

            this.columns.on('render-grid', this.initGrid, this);

            this.listenTo(this.grid.collection, 'backgrid:next', function (i, j, outOfBound) {
                console.log(i, j, outOfBound);
                if (outOfBound) {
                    this.grid.insertRow(this.blankRow, { at: (i + 1) });
                }
            });
            this.listenTo(this.grid.collection, "backgrid:sort", function () { alert("sorting!"); });
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
        },

        initGrid: function () {
            this.getRecords();
            this.render();
        },

        render: function () {
            this.$el.html(this.grid.render().el);
        },

        getGridBody: function () {
            var that = this;
            return Backgrid.Body.extend({
                render: function () {
                    var fragment = document.createDocumentFragment(),
                        i,
                        row;
                    this.$el.empty();
                    for (i = 0; i < this.rows.length; i++) {
                        row = this.rows[i];
                        fragment.appendChild(row.render().el);
                    }
                    this.el.appendChild(fragment);
                    // custom code to notify view of a table re-rendering.
                    if (this.rows.length > 0) {
                        that.trigger("row:added", this);
                    }
                    this.delegateEvents();
                    return this;
                }
            });
        },

        getGridRow: function () {
            return Backgrid.Row.extend({
                initialize: function (options) {
                    this.listenTo(this.model, "change", function (model, options) {
                        if (options && options.save === false) {
                            return;
                        }
                        model.save(model.changedAttributes(), {patch: true});
                    });
                    Backgrid.Row.prototype.initialize.call(this, options);
                }
            });
        },

        insertRowTop: function (e) {
            //	this.records.add({ project_id: 2 }, { at: 0 });
            //	todo: ensure that record auto-populates w/default project selected.
            //  ACTUALLY: we should require that users can only edit when an
            //	active project is selected.
            this.grid.insertRow(this.blankRow, { at: 0 });
            this.initLayout();
            e.preventDefault();
        },

        insertRowBottom: function (e) {
            this.grid.insertRow(this.blankRow, { at: this.records.length});
            this.initLayout();
            e.preventDefault();
        },

        reset: function () {
            console.log('reset happened...does anything call this function?');
            this.initLayout();
        }
    });
    return DataGrid;
});
